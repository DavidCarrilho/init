const { execFile } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');

const execFileAsync = promisify(execFile);

/**
 * Executa OCR em uma imagem PNG/JPG usando Tesseract
 * @param {string} imagePath - Caminho para o arquivo de imagem
 * @returns {Promise<{rawText: string, layout: object|null, engine: string}>}
 */
async function ocrImage(imagePath) {
  try {
    // Verificar se arquivo existe
    await fs.access(imagePath);

    // Executar Tesseract para extrair texto
    const args = [
      imagePath,
      'stdout',
      '-l', 'por+eng',  // Português + Inglês
      '--oem', '1',     // LSTM OCR Engine Mode
      '--psm', '3'      // Automatic page segmentation
    ];

    const { stdout, stderr } = await execFileAsync('tesseract', args, {
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
      timeout: 30000 // 30 segundos timeout
    });

    if (stderr) {
      console.warn('Tesseract warnings:', stderr);
    }

    // Para layout detalhado (opcional - pode implementar depois)
    let layout = null;
    try {
      // Executar TSV para obter coordenadas
      const tsvArgs = [
        imagePath,
        'stdout',
        '-l', 'por+eng',
        '--oem', '1',
        '--psm', '3',
        'tsv'
      ];

      const { stdout: tsvOutput } = await execFileAsync('tesseract', tsvArgs, {
        maxBuffer: 10 * 1024 * 1024,
        timeout: 30000
      });

      layout = parseTsvLayout(tsvOutput);
    } catch (layoutError) {
      console.warn('Erro ao extrair layout:', layoutError.message);
    }

    return {
      rawText: stdout.trim(),
      layout: layout,
      engine: 'tesseract'
    };

  } catch (error) {
    console.error('Erro no OCR:', error);
    throw new Error(`Falha no OCR: ${error.message}`);
  }
}

/**
 * Parse da saída TSV do Tesseract para extrair coordenadas
 * @param {string} tsvOutput - Saída TSV do Tesseract
 * @returns {object} Layout estruturado
 */
function parseTsvLayout(tsvOutput) {
  const lines = tsvOutput.split('\n');
  const header = lines[0].split('\t');
  const words = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split('\t');
    if (cols.length >= 12 && cols[11].trim()) { // Se tem texto
      words.push({
        level: parseInt(cols[0]) || 0,
        page_num: parseInt(cols[1]) || 0,
        block_num: parseInt(cols[2]) || 0,
        par_num: parseInt(cols[3]) || 0,
        line_num: parseInt(cols[4]) || 0,
        word_num: parseInt(cols[5]) || 0,
        left: parseInt(cols[6]) || 0,
        top: parseInt(cols[7]) || 0,
        width: parseInt(cols[8]) || 0,
        height: parseInt(cols[9]) || 0,
        conf: parseInt(cols[10]) || 0,
        text: cols[11].trim()
      });
    }
  }

  return {
    words: words,
    summary: {
      total_words: words.length,
      avg_confidence: words.reduce((sum, w) => sum + w.conf, 0) / words.length || 0
    }
  };
}

/**
 * Executa OCR em múltiplas imagens sequencialmente
 * @param {string[]} imagePaths - Array de caminhos para imagens
 * @returns {Promise<Array>} Array de resultados OCR
 */
async function ocrMultipleImages(imagePaths) {
  const results = [];

  for (const imagePath of imagePaths) {
    try {
      const result = await ocrImage(imagePath);
      results.push({
        path: imagePath,
        success: true,
        ...result
      });
    } catch (error) {
      console.error(`OCR falhou para ${imagePath}:`, error);
      results.push({
        path: imagePath,
        success: false,
        error: error.message
      });
    }
  }

  return results;
}

module.exports = {
  ocrImage,
  ocrMultipleImages
};