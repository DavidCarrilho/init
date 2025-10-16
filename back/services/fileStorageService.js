const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class FileStorageService {
  constructor() {
    this.baseUploadPath = path.join(__dirname, '..', 'uploads');
    this.laudosPath = path.join(this.baseUploadPath, 'laudos');
    this.atividadesPath = path.join(this.baseUploadPath, 'atividades');
    this.maxFileSize = 10 * 1024 * 1024; // 10MB
    this.allowedMimeTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    this.allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'];
  }

  /**
   * Inicializa os diretórios necessários
   */
  async initializeDirectories() {
    try {
      await fs.mkdir(this.baseUploadPath, { recursive: true });
      await fs.mkdir(this.laudosPath, { recursive: true });
      await fs.mkdir(this.atividadesPath, { recursive: true });
      console.log('✅ Diretórios de upload criados com sucesso');
    } catch (error) {
      console.error('❌ Erro ao criar diretórios:', error);
      throw error;
    }
  }

  /**
   * Gera um nome único para o arquivo
   */
  generateUniqueFileName(originalName, studentId, type = 'laudo') {
    const ext = path.extname(originalName);
    const timestamp = Date.now();
    const randomHash = crypto.randomBytes(6).toString('hex');
    return `${type}-${studentId}-${timestamp}-${randomHash}${ext}`;
  }

  /**
   * Valida o tipo de arquivo
   */
  validateFileType(file) {
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (!this.allowedExtensions.includes(ext)) {
      throw new Error(`Extensão não permitida. Aceitas: ${this.allowedExtensions.join(', ')}`);
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new Error(`Tipo MIME não permitido. Aceitos: ${this.allowedMimeTypes.join(', ')}`);
    }

    if (file.size > this.maxFileSize) {
      throw new Error(`Arquivo muito grande. Máximo: ${this.maxFileSize / (1024 * 1024)}MB`);
    }

    return true;
  }

  /**
   * Salva o arquivo no sistema local
   */
  async saveFile(file, studentId) {
    try {
      this.validateFileType(file);
      
      const fileName = this.generateUniqueFileName(file.originalname, studentId);
      const filePath = path.join(this.laudosPath, fileName);
      
      await fs.writeFile(filePath, file.buffer);
      
      return {
        fileName,
        filePath,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: `/uploads/laudos/${fileName}` // URL para servir o arquivo
      };
    } catch (error) {
      console.error('❌ Erro ao salvar arquivo:', error);
      throw error;
    }
  }

  /**
   * Remove um arquivo do sistema
   */
  async deleteFile(fileName) {
    try {
      const filePath = path.join(this.laudosPath, fileName);
      
      // Verifica se o arquivo existe antes de tentar deletar
      try {
        await fs.access(filePath);
        await fs.unlink(filePath);
        console.log(`✅ Arquivo deletado: ${fileName}`);
        return true;
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log(`⚠️ Arquivo não encontrado: ${fileName}`);
          return false;
        }
        throw error;
      }
    } catch (error) {
      console.error('❌ Erro ao deletar arquivo:', error);
      throw error;
    }
  }

  /**
   * Verifica se um arquivo existe
   */
  async fileExists(fileName) {
    try {
      const filePath = path.join(this.laudosPath, fileName);
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Obtém informações de um arquivo
   */
  async getFileInfo(fileName) {
    try {
      const filePath = path.join(this.laudosPath, fileName);
      const stats = await fs.stat(filePath);
      
      return {
        fileName,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        url: `/uploads/laudos/${fileName}`
      };
    } catch (error) {
      console.error('❌ Erro ao obter informações do arquivo:', error);
      throw error;
    }
  }

  /**
   * Lista todos os arquivos de laudos
   */
  async listFiles() {
    try {
      const files = await fs.readdir(this.laudosPath);
      const fileInfos = await Promise.all(
        files.map(async (fileName) => {
          try {
            return await this.getFileInfo(fileName);
          } catch {
            return null;
          }
        })
      );
      
      return fileInfos.filter(Boolean);
    } catch (error) {
      console.error('❌ Erro ao listar arquivos:', error);
      throw error;
    }
  }

  /**
   * Limpa arquivos órfãos (sem referência no banco)
   */
  async cleanupOrphanFiles(validFileNames = []) {
    try {
      const allFiles = await fs.readdir(this.laudosPath);
      const orphanFiles = allFiles.filter(fileName => !validFileNames.includes(fileName));
      
      let deletedCount = 0;
      for (const fileName of orphanFiles) {
        try {
          await this.deleteFile(fileName);
          deletedCount++;
        } catch (error) {
          console.error(`❌ Erro ao deletar arquivo órfão ${fileName}:`, error);
        }
      }
      
      console.log(`🧹 Limpeza concluída: ${deletedCount} arquivos órfãos removidos`);
      return deletedCount;
    } catch (error) {
      console.error('❌ Erro na limpeza de arquivos órfãos:', error);
      throw error;
    }
  }

  /**
   * Obtém estatísticas de armazenamento
   */
  async getStorageStats() {
    try {
      const files = await this.listFiles();
      const totalFiles = files.length;
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      
      return {
        totalFiles,
        totalSize,
        totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
        averageFileSizeMB: totalFiles > 0 ? (totalSize / totalFiles / (1024 * 1024)).toFixed(2) : 0
      };
    } catch (error) {
      console.error('❌ Erro ao obter estatísticas:', error);
      throw error;
    }
  }

  /**
   * Salva arquivo de atividade
   */
  async saveActivity(file, studentId) {
    try {
      this.validateFileType(file);
      
      const fileName = this.generateUniqueFileName(file.originalname, studentId, 'atividade');
      const filePath = path.join(this.atividadesPath, fileName);
      
      await fs.writeFile(filePath, file.buffer);
      
      return {
        fileName,
        filePath,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: `/uploads/atividades/${fileName}`
      };
    } catch (error) {
      console.error('❌ Erro ao salvar atividade:', error);
      throw error;
    }
  }

  /**
   * Verifica se arquivo de atividade existe
   */
  async activityExists(fileName) {
    try {
      const filePath = path.join(this.atividadesPath, fileName);
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Deleta arquivo de atividade
   */
  async deleteActivity(fileName) {
    try {
      const filePath = path.join(this.atividadesPath, fileName);
      
      const exists = await this.activityExists(fileName);
      if (exists) {
        await fs.unlink(filePath);
        console.log(`✅ Atividade removida: ${fileName}`);
      }
      
      return true;
    } catch (error) {
      console.error('❌ Erro ao remover atividade:', error);
      throw error;
    }
  }
}

module.exports = new FileStorageService();