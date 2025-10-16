const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');

const execAsync = promisify(exec);

/**
 * Converte páginas de PDF para imagens PNG
 * @param {string} pdfPath - Caminho para o arquivo PDF
 * @param {string} outDir - Diretório de saída para as imagens
 * @param {number} dpi - DPI para renderização (padrão: 200)
 * @returns {Promise<string[]>} Array com caminhos das imagens geradas
 */
async function pdfToPngs(pdfPath, outDir, dpi = 200) {
  try {
    // Verificar se PDF existe
    await fs.access(pdfPath);

    // Criar diretório de saída se não existir
    await fs.mkdir(outDir, { recursive: true });

    // Nome base para as páginas
    const baseName = path.join(outDir, 'page');

    // Comando pdftoppm para converter PDF → PNG
    const command = `pdftoppm -png -r ${dpi} "${pdfPath}" "${baseName}"`;

    const { stdout, stderr } = await execAsync(command, {
      maxBuffer: 50 * 1024 * 1024, // 50MB buffer
      timeout: 60000 // 60 segundos
    });

    if (stderr) {
      console.warn('pdftoppm warnings:', stderr);
    }

    // Listar arquivos gerados (page-1.png, page-2.png, etc.)
    const files = await fs.readdir(outDir);
    const pngFiles = files
      .filter(file => file.startsWith('page-') && file.endsWith('.png'))
      .sort((a, b) => {
        // Ordenar por número da página
        const numA = parseInt(a.match(/page-(\d+)\.png$/)?.[1] || '0');
        const numB = parseInt(b.match(/page-(\d+)\.png$/)?.[1] || '0');
        return numA - numB;
      })
      .map(file => path.join(outDir, file));

    console.log(`PDF convertido: ${pngFiles.length} páginas geradas`);
    return pngFiles;

  } catch (error) {
    console.error('Erro ao converter PDF:', error);
    throw new Error(`Falha na conversão PDF: ${error.message}`);
  }
}

/**
 * Obtém informações básicas do PDF
 * @param {string} pdfPath - Caminho para o arquivo PDF
 * @returns {Promise<{pages: number, title?: string, author?: string}>}
 */
async function getPdfInfo(pdfPath) {
  try {
    await fs.access(pdfPath);

    // Usar pdfinfo para obter metadados
    const command = `pdfinfo "${pdfPath}"`;
    const { stdout } = await execAsync(command, { timeout: 10000 });

    const info = {};
    const lines = stdout.split('\n');

    for (const line of lines) {
      if (line.includes('Pages:')) {
        info.pages = parseInt(line.split(':')[1].trim());
      } else if (line.includes('Title:')) {
        info.title = line.split(':')[1].trim();
      } else if (line.includes('Author:')) {
        info.author = line.split(':')[1].trim();
      }
    }

    return info;

  } catch (error) {
    console.error('Erro ao obter info do PDF:', error);
    // Retornar info mínima em caso de erro
    return { pages: 1 };
  }
}

/**
 * Converte imagem para PNG (se necessário)
 * @param {string} inputPath - Caminho da imagem original
 * @param {string} outputPath - Caminho da imagem PNG de saída
 * @returns {Promise<string>} Caminho da imagem PNG
 */
async function ensurePng(inputPath, outputPath) {
  const inputExt = path.extname(inputPath).toLowerCase();

  // Se já é PNG, apenas copiar
  if (inputExt === '.png') {
    await fs.copyFile(inputPath, outputPath);
    return outputPath;
  }

  // Converter usando ImageMagick (se disponível) ou outro método
  try {
    // Para simplificar no MVP, vamos apenas copiar JPEGs
    // Em produção, implementar conversão real
    if (inputExt === '.jpg' || inputExt === '.jpeg') {
      await fs.copyFile(inputPath, outputPath);
      return outputPath;
    }

    throw new Error(`Formato não suportado: ${inputExt}`);

  } catch (error) {
    console.error('Erro ao converter para PNG:', error);
    throw error;
  }
}

/**
 * Processo completo: detecta tipo de arquivo e converte para imagens
 * @param {string} filePath - Caminho do arquivo (PDF ou imagem)
 * @param {string} outputDir - Diretório para as imagens resultantes
 * @returns {Promise<{type: string, pages: string[], metadata: object}>}
 */
async function processFileToImages(filePath, outputDir) {
  const ext = path.extname(filePath).toLowerCase();
  const fileName = path.basename(filePath, ext);

  await fs.mkdir(outputDir, { recursive: true });

  if (ext === '.pdf') {
    // Processar PDF
    const pngFiles = await pdfToPngs(filePath, outputDir);
    const metadata = await getPdfInfo(filePath);

    return {
      type: 'pdf',
      pages: pngFiles,
      metadata: metadata
    };

  } else if (['.png', '.jpg', '.jpeg'].includes(ext)) {
    // Processar imagem única
    const outputPath = path.join(outputDir, `${fileName}.png`);
    await ensurePng(filePath, outputPath);

    return {
      type: 'image',
      pages: [outputPath],
      metadata: { pages: 1 }
    };

  } else {
    throw new Error(`Tipo de arquivo não suportado: ${ext}`);
  }
}

module.exports = {
  pdfToPngs,
  getPdfInfo,
  ensurePng,
  processFileToImages
};