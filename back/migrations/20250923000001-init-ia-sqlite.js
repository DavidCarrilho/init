'use strict';

/**
 * Migração para funcionalidades de IA - Versão SQLite para desenvolvimento local
 * NOTA: Esta é uma versão simplificada sem pgvector
 * Para produção, usar PostgreSQL com a migração completa
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    // Tabela de atividades
    await queryInterface.createTable('activities', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      studentId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'students',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      uploadId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      title: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {}
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Tabela de páginas de atividades
    await queryInterface.createTable('activity_pages', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      activityId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'activities',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      pageNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Tabela de extrações OCR
    await queryInterface.createTable('ocr_extractions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      activityPageId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'activity_pages',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      rawText: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      layout: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      engine: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'tesseract'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Tabela de nós de conhecimento
    await queryInterface.createTable('knowledge_nodes', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      groupLabel: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      targetConditions: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      signals: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      strategy: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      foundation: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      examples: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('ATIVO', 'INATIVO', 'RASCUNHO'),
        defaultValue: 'ATIVO'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Tabela de embeddings (simplificada para SQLite)
    await queryInterface.createTable('embeddings', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      sourceTable: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sourceId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      chunkIndex: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      vectorJson: {
        type: Sequelize.TEXT, // JSON string em SQLite
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Tabela de adaptações de atividades
    await queryInterface.createTable('activity_adaptations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      activityId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'activities',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      studentId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'students',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('PROCESSANDO', 'PRONTO', 'FALHA'),
        allowNull: false,
        defaultValue: 'PROCESSANDO'
      },
      resultJson: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      artifacts: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      error: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Índices para performance
    await queryInterface.addIndex('activities', ['studentId']);
    await queryInterface.addIndex('activity_pages', ['activityId']);
    await queryInterface.addIndex('ocr_extractions', ['activityPageId']);
    await queryInterface.addIndex('embeddings', ['sourceTable', 'sourceId']);
    await queryInterface.addIndex('activity_adaptations', ['activityId']);
    await queryInterface.addIndex('activity_adaptations', ['studentId']);

    console.log('✅ Migração IA SQLite executada com sucesso');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('activity_adaptations');
    await queryInterface.dropTable('embeddings');
    await queryInterface.dropTable('knowledge_nodes');
    await queryInterface.dropTable('ocr_extractions');
    await queryInterface.dropTable('activity_pages');
    await queryInterface.dropTable('activities');

    console.log('✅ Rollback da migração IA SQLite executado');
  }
};