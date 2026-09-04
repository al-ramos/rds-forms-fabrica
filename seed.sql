-- ============================================================
-- SEED de DESENVOLVIMENTO — AMR Forms Fábrica (SQLite)
--
-- Dados fictícios: veículos, produtos, fichas e notas fiscais.
-- NÃO é aplicado pela imagem de produção. Até 03/09/2026 o Dockerfile
-- rodava este arquivo no build, assando dados de demonstração dentro da
-- imagem — ver SEED-01.
--
-- Para popular uma base local:
--   sqlite3 amr_fabrica.db < seed.sql
-- ============================================================

INSERT OR IGNORE INTO VEICULO (CD_PLACA_VEICULO, CD_FILIAL, CD_UF_VEICULO, CD_RNTC_VEICULO)
VALUES
('ABC-1234', 2, 'GO', '0001'),
('DEF-5678', 1, 'AM', '3434343'),
('GHI-9012', 2, 'RJ', '2323223'),
('JKL-3456', 1, 'RR', '23323'),
('MNO-7890', 1, 'PR', '232323'),
('TER-5045', 2, 'SP', '45454');

INSERT OR IGNORE INTO FICHA (CD_FILIAL, DT_FICHA, CD_TIPO_OPERACAO, CD_PASSO_ATUAL, CD_PLACA_VEICULO, NO_MOTORISTA)
VALUES
(1, date('now'),           1, 1, 'ABC-1234', 'Motorista 1'),
(1, date('now','-1 day'),  2, 2, 'DEF-5678', 'Motorista 2'),
(2, date('now','-2 days'), 1, 3, 'GHI-9012', 'Motorista 3');

INSERT OR IGNORE INTO PRODUTO (CD_PRODUTO, NO_PRODUTO)
VALUES
(1, 'Soja em Grão'),
(2, 'Milho em Grão'),
(3, 'Trigo em Grão'),
(4, 'Farelo de Soja'),
(5, 'Óleo de Soja Bruto');

INSERT OR IGNORE INTO NOTA_FISCAL
(CD_NOTA_FISCAL, CD_SER_NOTA_FISCAL, CD_FILIAL, CD_FICHA, DT_EMISSAO_NF, NO_CLIENTE, CD_CNPJ_CLIENTE, VL_TRANSMISSAO)
VALUES
(1,  '001', 1, 1, date('now'),  'Cliente Teste LTDA',        '12.345.678/0001-99',  1500.00),
(2,  '001', 1, 1, date('now'),  'Empresa ABC S/A',           '98.765.432/0001-11',  3200.50),
(3,  '001', 2, 2, date('now'),  'Distribuidora XYZ',         '11.222.333/0001-44',   800.00),
(5,  '001', 1, 1, '2026-04-21', 'Comércio Global S/A',       '22.222.222/0001-02',  4750.50),
(6,  '001', 2, 2, '2026-04-21', 'Indústria Nacional ME',     '33.333.333/0001-03',  1650.00),
(7,  '001', 1, 1, '2026-04-20', 'Atacado do Sul Ltda',       '44.444.444/0001-04',  9800.00),
(8,  '001', 2, 2, '2026-04-20', 'Grupo Nordeste S/A',        '55.555.555/0001-05',  3300.00),
(9,  '001', 1, 1, '2026-04-20', 'Exportadora Brasil Corp',   '66.666.666/0001-06', 12500.00),
(10, '001', 2, 2, '2026-04-19', 'Logística Total ME',        '77.777.777/0001-07',  4200.00),
(11, '001', 1, 1, '2026-04-19', 'Frigorífico Central S/A',   '88.888.888/0001-08',  7600.00),
(12, '001', 2, 2, '2026-04-19', 'Cerealista do Oeste Ltda',  '99.999.999/0001-09',  5100.00),
(13, '001', 1, 1, '2026-04-18', 'Distribuidora Leste S/A',   '10.101.010/0001-10',  8900.00),
(14, '001', 2, 2, '2026-04-18', 'Importadora Paulista Ltda', '12.121.212/0001-11', 16400.00),
(15, '001', 1, 1, '2026-04-18', 'Grãos do Brasil S/A',       '13.131.313/0001-12',  4200.00),
(16, '001', 2, 2, '2026-04-17', 'Sucos e Bebidas Ltda',      '14.141.414/0001-13',  3750.00),
(17, '001', 1, 1, '2026-04-17', 'Cooperativa Agrícola S/A',  '15.151.515/0001-14',  6700.00),
(18, '001', 2, 2, '2026-04-17', 'Terminal Portuário Ltda',   '16.161.616/0001-15', 11200.00),
(19, '001', 1, 1, '2026-04-16', 'Atacarejo do Centro S/A',   '17.171.717/0001-16',  2890.00),
(20, '001', 2, 2, '2026-04-16', 'Papel e Celulose S/A',      '18.181.818/0001-17',  9300.00),
(21, '001', 1, 1, '2026-04-16', 'Mineradora Sudeste Ltda',   '19.191.919/0001-18', 14800.00),
(22, '001', 2, 2, '2026-04-15', 'Embalagens Flex S/A',       '20.202.020/0001-19',  3100.00),
(23, '001', 1, 1, '2026-04-15', 'Têxtil Brasil Ltda',        '21.212.121/0001-20',  5500.00),
(24, '001', 2, 2, '2026-04-15', 'Construtora Planalto S/A',  '22.222.222/0001-21',  7100.00),
(25, '001', 1, 1, '2026-04-14', 'Madeireira do Norte Ltda',  '23.232.323/0001-22',  4400.00),
(26, '001', 2, 2, '2026-04-14', 'Plásticos Especiais S/A',   '24.242.424/0001-23',  6200.00),
(27, '001', 1, 1, '2026-04-14', 'Metalúrgica Centro-Oeste',  '25.252.525/0001-24',  8900.00),
(28, '001', 2, 2, '2026-04-13', 'Borracharia Industrial',    '26.262.626/0001-25',  2300.00),
(29, '001', 1, 1, '2026-04-13', 'Química Industrial S/A',    '27.272.727/0001-26', 17600.00),
(30, '001', 2, 2, '2026-04-13', 'Fertilizantes Norte Ltda',  '28.282.828/0001-27',  5800.00),
(31, '001', 1, 1, '2026-04-12', 'Armazém Geral S/A',         '29.292.929/0001-28',  4100.00),
(32, '001', 2, 2, '2026-04-12', 'Frigorífico Sul Ltda',      '30.303.030/0001-29',  9600.00),
(33, '001', 1, 1, '2026-04-12', 'Transportes Reunidos S/A',  '31.313.131/0001-30',  3400.00),
(34, '001', 2, 2, '2026-04-11', 'Distribuidora Omega ME',    '32.323.232/0001-31',  7700.00),
(35, '001', 1, 1, '2026-04-11', 'Indústria Alfa S/A',        '33.333.333/0001-32', 13200.00),
(36, '001', 2, 2, '2026-04-11', 'Comércio Unido Ltda',       '34.343.434/0001-33',  2750.00),
(37, '001', 1, 1, '2026-04-10', 'Agropecuária Central S/A',  '35.353.535/0001-34',  6300.00),
(38, '001', 2, 2, '2026-04-10', 'Moinho do Vale ME',         '36.363.636/0001-35',  4900.00),
(39, '001', 1, 1, '2026-04-10', 'Logística Expressa Ltda',   '37.373.737/0001-36',  8100.00),
(40, '001', 2, 2, '2026-04-09', 'Atacado Nacional S/A',      '38.383.838/0001-37',  3600.00),
(41, '001', 1, 1, '2026-04-09', 'Importadora Delta Ltda',    '39.393.939/0001-38',  5200.00),
(42, '001', 2, 2, '2026-04-09', 'Exportadora Sigma ME',      '40.404.040/0001-39',  1100.00),
(43, '001', 1, 1, '2026-04-08', 'Cooperativa do Campo S/A',  '41.414.141/0001-40',  7400.00),
(44, '001', 2, 2, '2026-04-08', 'Teste Homolog ME',          '42.424.242/0001-41',   100.00),
(45, '001', 1, 1, '2026-04-08', 'Homolog Empresa S/A',       '43.434.343/0001-42',   200.00),
(46, '001', 2, 2, '2026-04-07', 'QA Transportes Ltda',       '44.444.444/0001-43',   150.00),
(47, '001', 1, 1, '2026-04-07', 'Dev Test Corp',             '45.454.545/0001-44',   300.00),
(48, '001', 2, 2, '2026-04-07', 'Pendente Transmissão Ltda', '46.464.646/0001-45',  4500.00),
(49, '001', 1, 1, '2026-04-06', 'Aguardando Envio S/A',      '47.474.747/0001-46',  8800.00),
(50, '001', 2, 2, '2026-04-06', 'Processando NF ME',         '48.484.848/0001-47',  2200.00),
(51, '001', 1, 1, '2026-04-06', 'Fila de Transmissão Ltda',  '49.494.949/0001-48',  6600.00),
(52, '001', 2, 2, '2026-04-05', 'Emissão Pendente S/A',      '50.505.050/0001-49',  3300.00),
(53, '001', 1, 1, '2026-04-05', 'Sem Protocolo Corp',        '51.515.151/0001-50',  9900.00);

INSERT OR IGNORE INTO NOTA_FISCAL_DETALHE
(CD_NOTA_FISCAL, CD_SER_NOTA_FISCAL, CD_FILIAL, CD_PRODUTO, QT_PRODUTO, UnidadeMedidaComercial, UnidadeMedida, VL_PRECO_UNITARIO, VL_TOTAL, VL_ALIQUOTA_ICMS, VL_IPI)
VALUES
(1, '001', 1, 1, 1000.000, 'KG', 'KG', 2.10, 2100.00, 12.00, 0.00),
(2, '001', 1, 2,  500.000, 'KG', 'KG', 9.50, 4750.50, 12.00, 0.00),
(3, '001', 2, 1,  750.000, 'KG', 'KG', 2.20, 1650.00, 12.00, 0.00),
(1, '001', 1, 2, 1200.000, 'KG', 'KG', 8.17, 9800.00, 12.00, 0.00),
(2, '001', 2, 1,  850.000, 'KG', 'KG', 3.88, 3300.00, 12.00, 0.00);
