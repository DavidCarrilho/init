'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const { UUID, UUIDV4, TEXT, JSONB, INTEGER, DATE, ENUM, ARRAY, STRING } = Sequelize;

    // Habilitar extensão pgvector
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS vector;');

    // Tabela de atividades escolares
    await queryInterface.createTable('activities', {
      id: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
      studentId: {
        type: UUID,
        allowNull: false,
        references: { model: 'students', key: 'id' },
        onDelete: 'CASCADE'
      },
      uploadId: { type: UUID, allowNull: false }, // referencia ao sistema de upload existente
      title: TEXT,
      metadata: JSONB,
      createdAt: { type: DATE, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: DATE, defaultValue: Sequelize.fn('NOW') },
    });

    // Tabela de páginas renderizadas (PDF → PNG)
    await queryInterface.createTable('activity_pages', {
      id: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
      activityId: {
        type: UUID,
        allowNull: false,
        references: { model: 'activities', key: 'id' },
        onDelete: 'CASCADE'
      },
      pageNumber: { type: INTEGER, allowNull: false },
      imageUrl: { type: TEXT, allowNull: false },
      createdAt: { type: DATE, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: DATE, defaultValue: Sequelize.fn('NOW') },
    });

    // Constraint única para atividade + página
    await queryInterface.addConstraint('activity_pages', {
      fields: ['activityId', 'pageNumber'],
      type: 'unique',
      name: 'u_activity_page'
    });

    // Tabela de extrações OCR
    await queryInterface.createTable('ocr_extractions', {
      id: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
      activityPageId: {
        type: UUID,
        allowNull: false,
        references: { model: 'activity_pages', key: 'id' },
        onDelete: 'CASCADE'
      },
      rawText: TEXT,
      layout: JSONB, // estrutura detectada (boxes, coords, etc)
      engine: STRING, // 'tesseract' ou outros
      createdAt: { type: DATE, defaultValue: Sequelize.fn('NOW') },
    });

    // Tabela de nós de conhecimento (base de boas práticas)
    await queryInterface.createTable('knowledge_nodes', {
      id: { type: STRING, primaryKey: true }, // slug como ID
      groupLabel: { type: STRING, allowNull: false },
      targetConditions: { type: ARRAY(STRING), allowNull: false }, // ['TEA', 'TDAH', etc]
      signals: { type: ARRAY(STRING) }, // sinais observáveis
      strategy: { type: JSONB, allowNull: false }, // estratégia detalhada
      foundation: { type: JSONB, allowNull: false }, // fundamentação científica
      examples: { type: ARRAY(STRING) }, // exemplos práticos
      contraindications: { type: ARRAY(STRING) }, // quando NÃO usar
      tags: { type: ARRAY(STRING) },
      lastUpdated: { type: DATE, allowNull: false },
      createdAt: { type: DATE, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: DATE, defaultValue: Sequelize.fn('NOW') },
    });

    // Tabela de embeddings para RAG
    await queryInterface.createTable('embeddings', {
      id: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
      sourceTable: { type: STRING, allowNull: false }, // 'knowledge_nodes' | 'ocr_extractions'
      sourceId: { type: STRING, allowNull: false },
      chunkIndex: { type: INTEGER, defaultValue: 0 },
      content: { type: TEXT, allowNull: false }, // texto indexado
      createdAt: { type: DATE, defaultValue: Sequelize.fn('NOW') },
    });

    // Adicionar coluna vector via SQL raw (Sequelize não suporta nativamente)
    await queryInterface.sequelize.query('ALTER TABLE embeddings ADD COLUMN vector VECTOR(1024);');

    // Tabela de adaptações geradas
    await queryInterface.createTable('activity_adaptations', {
      id: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
      activityId: {
        type: UUID,
        allowNull: false,
        references: { model: 'activities', key: 'id' },
        onDelete: 'CASCADE'
      },
      studentId: {
        type: UUID,
        allowNull: false,
        references: { model: 'students', key: 'id' },
        onDelete: 'CASCADE'
      },
      status: {
        type: ENUM('PENDENTE', 'PROCESSANDO', 'PRONTO', 'FALHA'),
        defaultValue: 'PENDENTE'
      },
      resultJson: { type: JSONB }, // resultado da adaptação
      artifacts: { type: JSONB }, // URLs dos arquivos gerados
      error: { type: TEXT },
      createdAt: { type: DATE, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: DATE, defaultValue: Sequelize.fn('NOW') },
    });

    // Índices para performance
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS embedding_source_idx
      ON embeddings (sourceTable, sourceId);
    `);

    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS embedding_vec_idx
      ON embeddings USING ivfflat (vector vector_cosine_ops);
    `);

    console.log('✅ Migração de IA concluída: pgvector + tabelas criadas');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('activity_adaptations');
    await queryInterface.dropTable('embeddings');
    await queryInterface.dropTable('knowledge_nodes');
    await queryInterface.dropTable('ocr_extractions');
    await queryInterface.dropTable('activity_pages');
    await queryInterface.dropTable('activities');

    // Extensão pgvector pode ficar para outros usos
    console.log('✅ Rollback de IA concluído');
  }
};