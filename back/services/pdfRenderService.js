const fs = require('fs').promises;
const path = require('path');

/**
 * Serviço para renderizar adaptações em PDF
 * MVP: Gera HTML e converte para PDF usando Puppeteer
 */

// Para o MVP, vamos usar uma implementação simples sem Puppeteer
// Em produção, adicionar Puppeteer ou biblioteca similar

/**
 * Renderiza adaptação para HTML
 * @param {object} adaptationJson - JSON da adaptação gerada
 * @returns {string} HTML renderizado
 */
function renderAdaptationToHtml(adaptationJson) {
  const {
    aluno_id,
    objetivos_adaptacao = [],
    estrategias_aplicadas = [],
    atividade_adaptada,
    orientacoes_ao_adulto,
    acessibilidade
  } = adaptationJson;

  const { atividade_adaptada: atividade } = adaptationJson;
  const { enunciado_reescrito, itens = [] } = atividade || {};

  // Configurações de acessibilidade
  const fontSize = acessibilidade?.fonte_maiuscula ? '18px' : '16px';
  const lineHeight = acessibilidade?.espacamento_linhas === 'amplo' ? '1.8' : '1.5';
  const contrast = acessibilidade?.uso_cores === 'alto contraste' ? 'high' : 'normal';

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Atividade Adaptada</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            font-size: ${fontSize};
            line-height: ${lineHeight};
            margin: 20px;
            color: ${contrast === 'high' ? '#000000' : '#333333'};
            background-color: ${contrast === 'high' ? '#FFFFFF' : '#FAFAFA'};
        }

        .header {
            text-align: center;
            border-bottom: 2px solid #4CAF50;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }

        .header h1 {
            color: #4CAF50;
            margin: 0;
            font-size: 24px;
        }

        .section {
            margin-bottom: 25px;
            padding: 15px;
            border-left: 4px solid #4CAF50;
            background-color: ${contrast === 'high' ? '#F8F8F8' : '#FFFFFF'};
        }

        .section h2 {
            color: #2E7D32;
            margin-top: 0;
            font-size: 20px;
        }

        .enunciado {
            background-color: #E8F5E8;
            padding: 20px;
            border-radius: 8px;
            border: 2px solid #4CAF50;
            margin-bottom: 20px;
        }

        .item {
            background-color: ${contrast === 'high' ? '#FFFFFF' : '#F9F9F9'};
            border: 1px solid #CCCCCC;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
        }

        .item-tipo {
            background-color: #2196F3;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            text-transform: uppercase;
            display: inline-block;
            margin-bottom: 10px;
        }

        .passo-a-passo {
            background-color: #FFF3E0;
            border-left: 4px solid #FF9800;
            padding: 10px;
            margin: 10px 0;
        }

        .passo-a-passo h4 {
            margin-top: 0;
            color: #F57C00;
        }

        .orientacoes {
            background-color: #E3F2FD;
            border: 1px solid #2196F3;
            border-radius: 8px;
            padding: 15px;
        }

        .orientacoes h3 {
            color: #1976D2;
            margin-top: 0;
        }

        ul {
            padding-left: 20px;
        }

        li {
            margin-bottom: 8px;
        }

        .tempo-sugerido {
            background-color: #FFEB3B;
            color: #F57F17;
            padding: 5px 10px;
            border-radius: 4px;
            font-weight: bold;
            display: inline-block;
            margin-top: 10px;
        }

        .estrategias {
            background-color: #F3E5F5;
            border: 1px solid #9C27B0;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
        }

        .footer {
            margin-top: 40px;
            text-align: center;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #DDD;
            padding-top: 20px;
        }

        @media print {
            body { margin: 0; }
            .section { break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📚 Atividade Adaptada</h1>
        <p>Adaptação pedagógica personalizada</p>
    </div>

    ${estrategias_aplicadas.length > 0 ? `
    <div class="estrategias">
        <h3>🎯 Estratégias Aplicadas</h3>
        <ul>
            ${estrategias_aplicadas.map(estrategia => `
                <li><strong>${estrategia.nome}</strong> - ${estrategia.porque}</li>
            `).join('')}
        </ul>
    </div>
    ` : ''}

    <div class="section">
        <h2>📝 Enunciado</h2>
        <div class="enunciado">
            ${enunciado_reescrito || 'Atividade adaptada para melhor compreensão.'}
        </div>
    </div>

    <div class="section">
        <h2>✏️ Atividades</h2>
        ${itens.map((item, index) => `
            <div class="item">
                <span class="item-tipo">${item.tipo.replace('_', ' ')}</span>
                <h3>Questão ${index + 1}</h3>
                <p><strong>${item.conteudo}</strong></p>

                ${item.passo_a_passo && item.passo_a_passo.length > 0 ? `
                <div class="passo-a-passo">
                    <h4>📋 Como fazer:</h4>
                    <ul>
                        ${item.passo_a_passo.map(passo => `<li>${passo}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}

                ${item.apoios_visuais && item.apoios_visuais.length > 0 ? `
                <p><strong>🎨 Apoios visuais:</strong> ${item.apoios_visuais.join(', ')}</p>
                ` : ''}

                ${item.tempo_sugerido_segundos ? `
                <span class="tempo-sugerido">
                    ⏱️ Tempo sugerido: ${Math.round(item.tempo_sugerido_segundos / 60)} minutos
                </span>
                ` : ''}
            </div>
        `).join('')}
    </div>

    ${orientacoes_ao_adulto ? `
    <div class="section">
        <h2>👨‍🏫 Orientações para o Educador</h2>
        <div class="orientacoes">
            ${orientacoes_ao_adulto.como_apresentar && orientacoes_ao_adulto.como_apresentar.length > 0 ? `
            <h3>✅ Como apresentar:</h3>
            <ul>
                ${orientacoes_ao_adulto.como_apresentar.map(item => `<li>${item}</li>`).join('')}
            </ul>
            ` : ''}

            ${orientacoes_ao_adulto.erros_comuns_a_evitar && orientacoes_ao_adulto.erros_comuns_a_evitar.length > 0 ? `
            <h3>❌ Erros a evitar:</h3>
            <ul>
                ${orientacoes_ao_adulto.erros_comuns_a_evitar.map(item => `<li>${item}</li>`).join('')}
            </ul>
            ` : ''}

            ${orientacoes_ao_adulto.sinais_de_sucesso && orientacoes_ao_adulto.sinais_de_sucesso.length > 0 ? `
            <h3>🎉 Sinais de sucesso:</h3>
            <ul>
                ${orientacoes_ao_adulto.sinais_de_sucesso.map(item => `<li>${item}</li>`).join('')}
            </ul>
            ` : ''}
        </div>
    </div>
    ` : ''}

    <div class="footer">
        <p>Atividade adaptada automaticamente pela plataforma INIT</p>
        <p>Data: ${new Date().toLocaleDateString('pt-BR')}</p>
    </div>
</body>
</html>`;

  return html;
}

/**
 * Salva HTML em arquivo
 * @param {string} html - Conteúdo HTML
 * @param {string} outputPath - Caminho do arquivo de saída
 * @returns {Promise<string>} Caminho do arquivo salvo
 */
async function saveHtmlFile(html, outputPath) {
  try {
    // Garantir que o diretório existe
    const dir = path.dirname(outputPath);
    await fs.mkdir(dir, { recursive: true });

    // Salvar arquivo HTML
    await fs.writeFile(outputPath, html, 'utf8');

    console.log(`📄 HTML salvo: ${outputPath}`);
    return outputPath;

  } catch (error) {
    console.error('Erro ao salvar HTML:', error);
    throw error;
  }
}

/**
 * Renderiza adaptação completa para arquivo HTML
 * @param {object} adaptationJson - JSON da adaptação
 * @param {string} outputPath - Caminho de saída
 * @returns {Promise<{htmlPath: string, pdfPath?: string}>} Caminhos dos arquivos gerados
 */
async function renderAdaptationToFile(adaptationJson, outputPath) {
  try {
    console.log('🎨 Renderizando adaptação para HTML...');

    // Gerar HTML
    const html = renderAdaptationToHtml(adaptationJson);

    // Definir caminhos dos arquivos
    const baseName = path.basename(outputPath, path.extname(outputPath));
    const dir = path.dirname(outputPath);
    const htmlPath = path.join(dir, `${baseName}.html`);

    // Salvar HTML
    await saveHtmlFile(html, htmlPath);

    const result = { htmlPath };

    // TODO: Em produção, adicionar conversão para PDF usando Puppeteer
    // const pdfPath = path.join(dir, `${baseName}.pdf`);
    // await convertHtmlToPdf(html, pdfPath);
    // result.pdfPath = pdfPath;

    console.log('✅ Adaptação renderizada com sucesso');
    return result;

  } catch (error) {
    console.error('Erro ao renderizar adaptação:', error);
    throw error;
  }
}

/**
 * Converte HTML para PDF usando Puppeteer (PLACEHOLDER)
 * @param {string} html - Conteúdo HTML
 * @param {string} outputPath - Caminho do PDF de saída
 * @returns {Promise<string>} Caminho do PDF gerado
 */
async function convertHtmlToPdf(html, outputPath) {
  // PLACEHOLDER: Em produção, implementar com Puppeteer
  //
  // const puppeteer = require('puppeteer');
  // const browser = await puppeteer.launch({
  //   args: ['--no-sandbox', '--disable-setuid-sandbox']
  // });
  // const page = await browser.newPage();
  // await page.setContent(html, { waitUntil: 'networkidle0' });
  // await page.pdf({
  //   path: outputPath,
  //   format: 'A4',
  //   printBackground: true
  // });
  // await browser.close();

  console.log('⚠️ Conversão PDF não implementada no MVP');
  return null;
}

/**
 * Gera nome de arquivo único baseado no timestamp
 * @param {string} studentId - ID do estudante
 * @param {string} activityId - ID da atividade
 * @returns {string} Nome do arquivo único
 */
function generateUniqueFilename(studentId, activityId) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `adaptation_${studentId}_${activityId}_${timestamp}_${random}`;
}

module.exports = {
  renderAdaptationToHtml,
  saveHtmlFile,
  renderAdaptationToFile,
  convertHtmlToPdf,
  generateUniqueFilename
};