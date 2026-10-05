/* Base editorial de Agro. Contenido general de orientación; no sustituye un
   diagnóstico de campo, una receta agronómica ni la etiqueta de un producto. */
window.AGROTEC_ASSISTANT_KNOWLEDGE = Object.freeze({
  ph: {
    label: 'pH de suelo y agua', aliases: ['ph', 'ph del suelo', 'ph del agua', 'acidez del suelo'],
    definition: 'El pH indica qué tan ácido o alcalino es un medio. Influye en la disponibilidad de nutrientes y en la actividad biológica, pero el valor adecuado cambia según el cultivo, el suelo, el sustrato y la calidad del agua.',
    practical: 'Para interpretarlo conviene medir con un método calibrado y revisar el pH junto con conductividad eléctrica, alcalinidad y análisis nutrimental; corregirlo sin ese contexto puede crear nuevos desequilibrios.',
    courseQueries: ['Diseño de Programas Nutricionales', 'Hidroponía para Todos', 'Fertirrigación']
  },
  conductividad: {
    label: 'Conductividad eléctrica', aliases: ['conductividad electrica', 'ce del suelo', 'ce del agua', 'ec del agua', 'sales disueltas'],
    definition: 'La conductividad eléctrica estima la cantidad de sales solubles presentes en agua, suelo o solución nutritiva. Un valor elevado puede dificultar la absorción de agua; uno demasiado bajo puede reflejar una solución poco concentrada.',
    practical: 'Debe interpretarse por cultivo, etapa, temperatura y sistema de producción. En fertirriego es útil comparar agua de entrada, solución aplicada y drenaje para detectar acumulación de sales.',
    courseQueries: ['Fertirrigación', 'Hidroponía para Todos', 'Diseño de Programas Nutricionales']
  },
  salinidad: {
    label: 'Salinidad', aliases: ['salinidad', 'suelo salino', 'agua salina', 'exceso de sales'],
    definition: 'La salinidad es la acumulación de sales que reduce la capacidad de la planta para tomar agua y puede causar desbalances nutrimentales o daño específico por ciertos iones.',
    practical: 'El manejo empieza con análisis de agua y suelo, revisión del drenaje y uniformidad de riego. Lavar sales solo funciona cuando existe agua adecuada y una salida efectiva para el drenaje.',
    courseQueries: ['Fertirrigación', 'Diseño de Programas Nutricionales']
  },
  npk: {
    label: 'NPK', aliases: ['npk', 'nitrogeno fosforo potasio', 'n p k', 'macronutrientes'],
    definition: 'NPK representa nitrógeno, fósforo y potasio, tres nutrientes esenciales. El nitrógeno participa en crecimiento y proteínas; el fósforo en energía y desarrollo; y el potasio en regulación hídrica, calidad y tolerancia al estrés.',
    practical: 'Una fórmula NPK no es una receta universal. La dosis y relación deben partir de la demanda del cultivo, etapa, rendimiento esperado y aportes del suelo, agua y materia orgánica.',
    courseQueries: ['Diseño de Programas Nutricionales', 'Fertirrigación', 'Agronomía para No Agrónomos']
  },
  micronutrientes: {
    label: 'Micronutrientes', aliases: ['micronutriente', 'micronutrientes', 'hierro zinc boro', 'deficiencia de hierro'],
    definition: 'Los micronutrientes, como hierro, zinc, boro, manganeso, cobre, molibdeno, cloro y níquel, se requieren en cantidades pequeñas pero cumplen funciones indispensables.',
    practical: 'Síntomas parecidos pueden tener causas diferentes. Antes de corregir conviene revisar patrón de aparición, pH, raíces, riego y análisis foliar o de suelo; aplicar de más también puede provocar toxicidad.',
    courseQueries: ['Diseño de Programas Nutricionales', 'Fertirrigación']
  },
  materiaOrganica: {
    label: 'Materia orgánica', aliases: ['materia organica', 'carbono del suelo', 'humus'],
    definition: 'La materia orgánica incluye residuos y compuestos de origen biológico en distintos grados de descomposición. Ayuda a la estructura, retención de agua, intercambio de nutrientes y actividad microbiana del suelo.',
    practical: 'Se construye con aportes constantes, raíces vivas, coberturas y menor perturbación. El efecto depende de la calidad del material, clima, textura y manejo; no reemplaza automáticamente un programa nutrimental.',
    courseQueries: ['Lombricomposta', 'Agricultura Orgánica', 'Bioinsumos']
  },
  composta: {
    label: 'Composta', aliases: ['composta', 'compost', 'compostaje', 'abono organico'],
    definition: 'La composta es el producto estabilizado de una descomposición aeróbica controlada de materiales orgánicos. Una buena composta debe alcanzar madurez, mantener aireación y humedad adecuadas y evitar contaminantes.',
    practical: 'El material fresco o mal estabilizado puede inmovilizar nitrógeno, contener patógenos o dañar raíces. Conviene registrar ingredientes, temperatura, volteos, humedad y tiempo de maduración.',
    courseQueries: ['Lombricomposta', 'Agricultura Orgánica', 'Biofábricas']
  },
  cobertura: {
    label: 'Cultivos de cobertura', aliases: ['cultivo de cobertura', 'cultivos de cobertura', 'abono verde', 'suelo cubierto'],
    definition: 'Los cultivos de cobertura se establecen principalmente para proteger y mejorar el suelo. Pueden reducir erosión, alimentar la biología, aportar residuos, competir con malezas y favorecer infiltración.',
    practical: 'La especie, fecha de siembra y terminación deben ajustarse al clima y al cultivo comercial para evitar competencia por agua, hospedaje de plagas o retrasos en la siguiente labor.',
    courseQueries: ['Agricultura Orgánica', 'Agronomía para No Agrónomos']
  },
  rotacion: {
    label: 'Rotación de cultivos', aliases: ['rotacion de cultivos', 'rotar cultivos', 'alternancia de cultivos'],
    definition: 'La rotación alterna familias o tipos de cultivo a través del tiempo para diversificar raíces, uso de nutrientes y periodos de producción. Puede ayudar a interrumpir ciclos de plagas, enfermedades y malezas.',
    practical: 'Una rotación útil considera familias botánicas, hospederos compartidos, profundidad de raíces, fechas, mercado y disponibilidad de agua; cambiar de especie sin cambiar de familia puede aportar poco.',
    courseQueries: ['Agricultura Orgánica', 'Agronomía para No Agrónomos']
  },
  compactacion: {
    label: 'Compactación del suelo', aliases: ['compactacion', 'suelo compactado', 'piso de arado'],
    definition: 'La compactación reduce poros grandes, limita aireación, infiltración y crecimiento de raíces. Puede originarse por tránsito o labores cuando el suelo está húmedo, cargas elevadas o laboreo repetido a la misma profundidad.',
    practical: 'Antes de subsolar conviene confirmar profundidad y continuidad de la capa compactada. Controlar tránsito, evitar trabajar en húmedo, mantener raíces y materia orgánica suele dar resultados más duraderos.',
    courseQueries: ['Agronomía para No Agrónomos', 'Agricultura Orgánica']
  },
  erosion: {
    label: 'Erosión del suelo', aliases: ['erosion', 'perdida de suelo', 'erosion hidrica', 'erosion eolica'],
    definition: 'La erosión es el desprendimiento y transporte de suelo por agua, viento o manejo. La capa superficial suele concentrar materia orgánica y nutrientes, por lo que perderla afecta productividad y calidad del agua.',
    practical: 'Cobertura permanente, menor longitud de pendiente, barreras, curvas a nivel, raíces vivas y menor perturbación ayudan; la combinación correcta depende de pendiente, lluvia, textura y cultivo.',
    courseQueries: ['Agricultura Orgánica', 'Agronomía para No Agrónomos']
  },
  evapotranspiracion: {
    label: 'Evapotranspiración', aliases: ['evapotranspiracion', 'et0', 'eto', 'et del cultivo'],
    definition: 'La evapotranspiración combina el agua que se evapora del suelo y la que transpira la planta. Sirve como referencia para estimar la demanda hídrica a partir del clima y del estado del cultivo.',
    practical: 'Para programar riego se ajusta la referencia climática con un coeficiente del cultivo y después se considera eficiencia del sistema, lluvia efectiva, suelo, raíces y mediciones de humedad.',
    courseQueries: ['Fertirrigación', 'Agronomía para No Agrónomos']
  },
  goteo: {
    label: 'Riego por goteo', aliases: ['riego por goteo', 'cinta de goteo', 'goteros', 'riego localizado'],
    definition: 'El riego por goteo aplica caudales pequeños cerca de la zona radicular y permite riegos frecuentes. Puede mejorar uniformidad y eficiencia, pero depende de diseño hidráulico, filtración, presión y mantenimiento.',
    practical: 'Antes de cambiar tiempos de riego conviene medir caudal real y uniformidad. Filtros sucios, fugas, presión desigual u obstrucciones pueden hacer que un programa correcto en papel falle en campo.',
    courseQueries: ['Fertirrigación', 'Hidroponía para Todos']
  },
  drenaje: {
    label: 'Drenaje agrícola', aliases: ['drenaje agricola', 'mal drenaje', 'encharcamiento', 'exceso de agua'],
    definition: 'El drenaje permite retirar agua excedente de la zona de raíces. Cuando falta oxígeno, disminuye la actividad radicular y aumentan riesgos de pudriciones y desbalances.',
    practical: 'La solución puede involucrar nivelación, camas, estructura del suelo, salidas superficiales o drenaje subsuperficial. Primero hay que distinguir si el problema es exceso de aplicación, capa restrictiva o nivel freático.',
    courseQueries: ['Agronomía para No Agrónomos', 'Manejo de Viveros']
  },
  calidadAgua: {
    label: 'Calidad del agua de riego', aliases: ['calidad del agua', 'agua de riego', 'analisis de agua', 'agua dura'],
    definition: 'La calidad del agua de riego se evalúa por sales, sodio, bicarbonatos, pH, nutrientes, contaminantes y riesgo microbiológico. Sus efectos dependen del cultivo, suelo, sistema y forma de aplicación.',
    practical: 'Un análisis periódico permite prevenir salinidad, sodicidad, precipitados, obstrucciones y riesgos de inocuidad. No conviene decidir solo por apariencia, olor o una lectura aislada.',
    courseQueries: ['Fertirrigación', 'Inocuidad Alimentaria', 'Hidroponía para Todos']
  },
  mip: {
    label: 'Manejo integrado de plagas', aliases: ['mip', 'manejo integrado', 'manejo integrado de plagas'],
    definition: 'El manejo integrado de plagas combina prevención, monitoreo y métodos culturales, biológicos, físicos y químicos para mantener el daño por debajo de un nivel inaceptable con el menor riesgo posible.',
    practical: 'La secuencia útil es identificar correctamente, medir incidencia o población, reconocer enemigos naturales, definir un umbral y evaluar el resultado. Aplicar por calendario puede elevar costos y resistencia.',
    courseQueries: ['Bioinsumos', 'Agronomía para No Agrónomos']
  },
  enfermedades: {
    label: 'Enfermedades de plantas', aliases: ['enfermedad de plantas', 'enfermedades del cultivo', 'fitopatologia', 'planta enferma'],
    definition: 'Una enfermedad vegetal aparece cuando coinciden un hospedero susceptible, un agente capaz de causar daño y un ambiente favorable. Hongos, oomicetos, bacterias, virus y otros organismos pueden producir síntomas similares.',
    practical: 'Para diagnosticar conviene observar distribución en el lote, órganos afectados, avance, clima, riego y raíces. Una fotografía aislada rara vez basta para elegir tratamiento.',
    courseQueries: ['Bioinsumos', 'Producción de Plántulas', 'Manejo de Viveros']
  },
  malezas: {
    label: 'Manejo de malezas', aliases: ['maleza', 'malezas', 'hierba mala', 'control de malezas'],
    definition: 'Las malezas son plantas que interfieren con el objetivo productivo al competir por luz, agua, espacio o nutrientes, dificultar labores o servir como hospederas.',
    practical: 'El manejo efectivo combina prevención, identificación, oportunidad, cobertura, rotación y controles mecánicos o químicos cuando correspondan. La etapa joven suele ser más manejable que una infestación con semilla madura.',
    courseQueries: ['Agricultura Orgánica', 'Agronomía para No Agrónomos']
  },
  agroquimicos: {
    label: 'Uso responsable de agroquímicos', aliases: ['agroquimico', 'agroquimicos', 'plaguicida', 'pesticida', 'insecticida', 'fungicida', 'herbicida'],
    definition: 'Los agroquímicos son herramientas con beneficios y riesgos que deben emplearse solo para usos autorizados, siguiendo etiqueta, equipo de protección, compatibilidad, intervalo de reingreso, periodo de carencia y disposición de envases.',
    practical: 'No existe una dosis segura universal: cambia por producto, formulación, cultivo, plaga y registro local. Para una recomendación concreta se necesita la etiqueta vigente y un responsable técnico.',
    courseQueries: ['Inocuidad Alimentaria', 'Agronomía para No Agrónomos']
  },
  controlBiologico: {
    label: 'Control biológico', aliases: ['control biologico', 'enemigos naturales', 'insectos beneficos'],
    definition: 'El control biológico usa organismos vivos o favorece enemigos naturales para reducir poblaciones de plagas. Incluye estrategias de conservación, liberación y uso de agentes microbianos.',
    practical: 'Su desempeño depende de identificación, oportunidad, clima, calidad del agente y compatibilidad con plaguicidas. “Natural” no significa que pueda aplicarse sin evaluación o manejo.',
    courseQueries: ['Bioinsumos', 'Biofábricas', 'Polinizadores']
  },
  semilla: {
    label: 'Calidad de semilla', aliases: ['semilla', 'semillas', 'calidad de semilla', 'semilla certificada'],
    definition: 'La calidad de una semilla integra identidad genética, germinación, vigor, pureza y sanidad. Dos lotes con el mismo porcentaje de germinación pueden comportarse distinto bajo estrés por diferencias de vigor.',
    practical: 'Revisa procedencia, fecha, almacenamiento y prueba de germinación. La densidad de siembra debe considerar porcentaje de establecimiento real, no solo el número de semillas del envase.',
    courseQueries: ['Producción de Plántulas', 'Manejo de Viveros']
  },
  germinacion: {
    label: 'Germinación', aliases: ['germinacion', 'germinar', 'no germinan', 'nacimiento de plantas'],
    definition: 'La germinación comienza cuando una semilla viable absorbe agua y reactiva su metabolismo hasta emitir la raíz. Agua, oxígeno, temperatura y, en algunas especies, luz o tratamientos previos determinan el resultado.',
    practical: 'Si falla, separa viabilidad de condiciones de siembra: revisa profundidad, humedad uniforme sin saturación, temperatura, salinidad, sanidad y edad de la semilla.',
    courseQueries: ['Producción de Plántulas', 'Manejo de Viveros']
  },
  trasplante: {
    label: 'Trasplante', aliases: ['trasplante', 'trasplantar', 'estres de trasplante'],
    definition: 'El trasplante mueve una plántula al sitio definitivo. El éxito depende de raíces sanas, tamaño adecuado, endurecimiento, humedad, temperatura y poco daño al cepellón.',
    practical: 'Aclimatar gradualmente, trasplantar en horas menos demandantes y asegurar contacto entre raíz y suelo ayuda. El exceso de agua después del trasplante también puede reducir oxígeno.',
    courseQueries: ['Producción de Plántulas', 'Manejo de Viveros']
  },
  poda: {
    label: 'Poda', aliases: ['poda', 'podar', 'despunte', 'raleo de brotes'],
    definition: 'La poda elimina o dirige órganos para equilibrar crecimiento, entrada de luz, ventilación, carga y facilidad de manejo. El objetivo cambia entre formación, producción, renovación y sanidad.',
    practical: 'Una poda intensa no siempre aumenta rendimiento. Debe ajustarse a especie, edad, época, vigor y riesgo sanitario, usando herramientas limpias y cortes adecuados.',
    courseQueries: ['Árboles Frutales', 'Producción de Papaya', 'Manejo de Chiles Verdes']
  },
  cuajado: {
    label: 'Floración y cuajado', aliases: ['cuajado', 'amarre de fruto', 'floracion', 'caida de flores'],
    definition: 'El cuajado es la transición de la flor hacia un fruto en desarrollo. Polinización, viabilidad floral, temperatura, agua, nutrición, carga y sanidad pueden limitarlo.',
    practical: 'Antes de aplicar estimulantes conviene registrar floración, clima, presencia de polinizadores, riego y patrón de caída. El problema rara vez se explica por un solo nutriente.',
    courseQueries: ['Floración y Cuajado en Frutales Tropicales', 'Polinizadores', 'Árboles Frutales']
  },
  poscosecha: {
    label: 'Poscosecha', aliases: ['poscosecha', 'postcosecha', 'vida de anaquel', 'conservacion de cosecha'],
    definition: 'La poscosecha reúne operaciones desde la recolección hasta el consumo para conservar calidad y reducir pérdidas. Temperatura, humedad, golpes, respiración, higiene y tiempo son variables clave.',
    practical: 'La cadena debe diseñarse desde el momento de corte: cosechar con madurez adecuada, retirar calor cuando corresponda, manipular con cuidado y mantener trazabilidad.',
    courseQueries: ['Inocuidad Alimentaria', 'Exportación Agrícola', 'Derivados Dulces de Amaranto']
  },
  trazabilidad: {
    label: 'Trazabilidad', aliases: ['trazabilidad', 'rastreabilidad', 'lote de produccion', 'registro de campo'],
    definition: 'La trazabilidad permite seguir un producto, insumo o actividad a través de registros vinculados a lotes, fechas y responsables. Facilita investigar fallas, demostrar cumplimiento y retirar producto si fuera necesario.',
    practical: 'Empieza con identificadores simples y consistentes para parcela, lote, cosecha e insumos. Un registro corto y completo vale más que un formato complejo que nadie mantiene.',
    courseQueries: ['Inocuidad Alimentaria', 'Exportación Agrícola', 'Contabilidad Agrícola']
  },
  bpa: {
    label: 'Buenas prácticas agrícolas', aliases: ['buenas practicas agricolas', 'bpa', 'gap agricola'],
    definition: 'Las buenas prácticas agrícolas organizan medidas para producir con calidad e inocuidad, cuidar a las personas y reducir impactos ambientales. Incluyen agua, higiene, insumos, cosecha, registros y capacitación.',
    practical: 'La implementación comienza identificando peligros y puntos de control en la unidad productiva, asignando responsables y dejando evidencia verificable de lo que se hace.',
    courseQueries: ['Inocuidad Alimentaria', 'Exportación Agrícola']
  },
  precision: {
    label: 'Agricultura de precisión', aliases: ['agricultura de precision', 'sensores agricolas', 'mapas de rendimiento', 'teledeteccion'],
    definition: 'La agricultura de precisión usa datos georreferenciados, sensores, imágenes y automatización para reconocer variabilidad y manejar cada zona con mayor detalle.',
    practical: 'La tecnología aporta valor cuando responde una decisión concreta. Primero define qué quieres medir, con qué frecuencia y qué acción cambiará según el resultado.',
    courseQueries: ['IA en Agricultura', 'Agronomía para No Agrónomos']
  },
  drones: {
    label: 'Drones en agricultura', aliases: ['drone agricola', 'drones agricolas', 'dron en el campo'],
    definition: 'Los drones pueden capturar imágenes, generar mapas y apoyar inspecciones; algunos equipos también realizan aplicaciones. Una imagen detecta diferencias, pero no confirma por sí sola la causa.',
    practical: 'Conviene validar anomalías en campo y respetar regulación, clima, calibración, privacidad y seguridad. El indicador útil es el que cambia una decisión agronómica.',
    courseQueries: ['IA en Agricultura', 'Agronomía para No Agrónomos']
  },
  clima: {
    label: 'Agricultura climáticamente inteligente', aliases: ['agricultura climatica', 'agricultura climaticamente inteligente', 'cambio climatico y agricultura', 'resiliencia climatica'],
    definition: 'La agricultura climáticamente inteligente busca mejorar productividad e ingresos, aumentar adaptación y resiliencia y, cuando sea posible, reducir emisiones, siempre con soluciones ajustadas al contexto local.',
    practical: 'Diversificar, cuidar suelo y agua, usar información climática, ajustar fechas y reducir pérdidas son ejemplos; no existe un paquete único que funcione igual en todas las regiones.',
    courseQueries: ['Agricultura Orgánica', 'IA en Agricultura', 'Agronomía para No Agrónomos']
  },
  costos: {
    label: 'Costos de producción', aliases: ['costos de produccion', 'costo por hectarea', 'gastos del cultivo', 'rentabilidad agricola'],
    definition: 'El costo de producción suma recursos directos e indirectos usados para producir: insumos, mano de obra, maquinaria, agua, energía, renta, financiamiento, depreciación y pérdidas.',
    practical: 'Para decidir mejor separa costos fijos y variables, calcula costo por unidad vendible y compara escenario esperado, conservador y crítico. Rendimiento alto no garantiza rentabilidad si suben mermas o precio de venta cae.',
    courseQueries: ['Contabilidad Agrícola', 'Exportación Agrícola']
  },
  puntoEquilibrio: {
    label: 'Punto de equilibrio', aliases: ['punto de equilibrio', 'cuanto debo vender', 'recuperar inversion'],
    definition: 'El punto de equilibrio es el volumen o ingreso donde las ventas cubren costos totales sin utilidad ni pérdida. Depende del precio, costo variable por unidad y costos fijos.',
    practical: 'Usa unidades comercializables, no producción bruta, e incorpora merma y comisiones. Después prueba qué ocurre si cambia precio, rendimiento o costo de insumos.',
    courseQueries: ['Contabilidad Agrícola', 'Exportación Agrícola']
  },
  valorAgregado: {
    label: 'Valor agregado', aliases: ['valor agregado', 'transformar producto', 'agroindustria', 'producto procesado'],
    definition: 'Agregar valor significa aumentar utilidad o diferenciación mediante selección, empaque, transformación, marca, conveniencia, calidad o servicio, no solamente subir el precio.',
    practical: 'Antes de invertir valida cliente, vida útil, inocuidad, rendimiento del proceso, costo por unidad, permisos y canal de venta.',
    courseQueries: ['Derivados Dulces de Amaranto', 'Alimentos Funcionales', 'Inocuidad Alimentaria']
  },
  exportacion: {
    label: 'Exportación agrícola', aliases: ['exportacion agricola', 'exportar', 'mercado de exportacion'],
    definition: 'Exportar productos agrícolas exige cumplir requisitos del mercado destino sobre sanidad, inocuidad, calidad, documentación, empaque, logística y trazabilidad.',
    practical: 'La ruta empieza por producto y destino específicos. Después se verifica admisibilidad, requisitos fitosanitarios, comprador, costos logísticos y capacidad constante de suministro.',
    courseQueries: ['Exportación Agrícola', 'Inocuidad Alimentaria', 'Contabilidad Agrícola']
  },
  maiz: {
    label: 'Cultivo de maíz', aliases: ['maiz', 'cultivo de maiz', 'milpa'],
    definition: 'El maíz es un cultivo sensible a la interacción entre genética, fecha, población, agua, nutrición, malezas y sanidad. Sus periodos alrededor de floración y llenado suelen ser decisivos para el rendimiento.',
    practical: 'Una recomendación comienza con objetivo de grano o forraje, temporal o riego, ciclo, suelo, híbrido o variedad y rendimiento meta; copiar una densidad o fertilización de otra parcela puede fallar.',
    courseQueries: ['Maíz', 'Diseño de Programas Nutricionales', 'Agronomía para No Agrónomos']
  },
  cacao: {
    label: 'Producción de cacao', aliases: ['cacao', 'cultivo de cacao', 'produccion de cacao'],
    definition: 'El cacao es un cultivo perenne tropical cuyo desempeño depende de material vegetal, sombra, humedad, suelo, poda, sanidad y manejo de cosecha y fermentación.',
    practical: 'El diagnóstico debe separar problemas de establecimiento, nutrición, enfermedades y poscosecha, porque cada etapa cambia tanto el rendimiento como la calidad final.',
    courseQueries: ['Producción de Cacao', 'Diseño de Programas Nutricionales']
  },
  papaya: {
    label: 'Producción de papaya', aliases: ['papaya', 'cultivo de papaya', 'produccion de papaya'],
    definition: 'La papaya es un frutal tropical de crecimiento rápido que requiere buen drenaje, población uniforme, nutrición equilibrada, sanidad y manejo de sexo o tipo de planta según el material.',
    practical: 'Encharcamiento, virosis, problemas de raíz y desbalances pueden confundirse. Conviene revisar historial, distribución, agua, vectores y síntomas antes de actuar.',
    courseQueries: ['Producción de Papaya', 'Diseño de Programas Nutricionales']
  },
  berries: {
    label: 'Cultivo de berries', aliases: ['berry', 'berries', 'frutos rojos', 'fresa frambuesa arandano zarzamora'],
    definition: 'Berries agrupa cultivos con requerimientos distintos, pero generalmente de alto valor y exigentes en material vegetal, agua, sustrato o suelo, nutrición, sanidad, frío y manejo poscosecha.',
    practical: 'La especie, variedad, clima y mercado cambian por completo el sistema. Define primero el cultivo y destino antes de diseñar infraestructura o programa nutrimental.',
    courseQueries: ['Cultivo de berries', 'Diseño de Programas Nutricionales', 'Fertirrigación']
  },
  nopal: {
    label: 'Aprovechamiento del nopal', aliases: ['nopal', 'cultivo de nopal', 'aprovechamiento del nopal'],
    definition: 'El nopal es una cactácea adaptada a condiciones secas y con usos como verdura, fruta, forraje y materia prima. Aun siendo resistente, calidad y rendimiento dependen de material, densidad, nutrición, sanidad y cosecha.',
    practical: 'El manejo debe definirse según si el objetivo es nopalito, tuna, forraje o transformación, porque cambian poda, cosecha, calidad y mercado.',
    courseQueries: ['Aprovechamiento del Nopal', 'Alimentos Funcionales']
  },
  pitahaya: {
    label: 'Manejo de pitahaya', aliases: ['pitahaya', 'pitaya', 'cultivo de pitahaya'],
    definition: 'La pitahaya es una cactácea trepadora que requiere soporte, conducción, poda y atención a polinización, humedad y sanidad para equilibrar crecimiento y producción.',
    practical: 'Antes de establecer conviene revisar especie o variedad, adaptación climática, sistema de tutores, disponibilidad de polinizadores y mercado.',
    courseQueries: ['Manejo de Pitahaya', 'Polinizadores']
  },
  hongos: {
    label: 'Producción de hongos comestibles', aliases: ['hongos comestibles', 'cultivo de hongos', 'setas', 'produccion de hongos'],
    definition: 'La producción de hongos comestibles transforma un sustrato preparado mediante un cultivo controlado de micelio. Higiene, calidad del inóculo, humedad, temperatura, ventilación y manejo del sustrato son fundamentales.',
    practical: 'Muchos fracasos provienen de contaminación o ambiente inestable. Registrar lotes y separar incubación, fructificación y limpieza ayuda a encontrar la causa.',
    courseQueries: ['Producción de Hongos', 'Inocuidad Alimentaria']
  },
  chile: {
    label: 'Manejo de chiles', aliases: ['chile verde', 'chiles', 'cultivo de chile', 'manejo de chile'],
    definition: 'Los chiles requieren un establecimiento uniforme y manejo coordinado de agua, nutrición, temperatura, poda cuando aplica y sanidad. Excesos y déficits de agua pueden afectar raíces, flores y frutos.',
    practical: 'Para diagnosticar caída de flor, deformaciones o bajo rendimiento conviene relacionar el síntoma con etapa, clima, riego, conductividad, plagas y distribución en el lote.',
    courseQueries: ['Manejo de Chiles Verdes', 'Fertirrigación', 'Diseño de Programas Nutricionales']
  },
  tomatillo: {
    label: 'Cultivo de tomatillo', aliases: ['tomatillo', 'tomate verde', 'cultivo de tomate verde'],
    definition: 'El tomatillo es una solanácea cuya productividad depende de población, polinización, agua, nutrición, malezas y sanidad. La presencia de varias plantas favorece el intercambio de polen.',
    practical: 'Fecha, variedad y presión de plagas deben ajustarse a la región. Monitorear desde etapas tempranas permite actuar antes de perder flores o área foliar.',
    courseQueries: ['Cultivo de Tomatillo', 'Polinizadores']
  },
  frutales: {
    label: 'Árboles frutales', aliases: ['arboles frutales', 'fruticultura', 'huerto frutal', 'frutales'],
    definition: 'El manejo de frutales integra años de decisiones sobre portainjerto, variedad, formación, poda, carga, riego, nutrición, polinización, sanidad y cosecha.',
    practical: 'La recomendación cambia con especie, edad, clima y objetivo. Un calendario fenológico local ayuda a colocar cada labor en el momento correcto.',
    courseQueries: ['Árboles Frutales', 'Floración y Cuajado en Frutales Tropicales', 'Polinizadores']
  },
  luna: {
    label: 'Fases lunares y agricultura', aliases: ['luna', 'fase lunar', 'fases lunares', 'calendario lunar'],
    definition: 'Las fases lunares forman parte de prácticas agrícolas tradicionales, pero la evidencia disponible no permite asumir que por sí solas determinen germinación, rendimiento o calidad de todos los cultivos. Factores como humedad, temperatura, variedad, suelo y manejo suelen tener un efecto más directo y medible.',
    practical: 'Si quieres evaluar una práctica lunar, compárala en la misma parcela con fechas distintas pero semilla, manejo y condiciones equivalentes, registra emergencia y rendimiento y repite más de un ciclo. Así conviertes la experiencia en evidencia propia.',
    courseQueries: ['Agronomía para No Agrónomos', 'Maíz']
  }
});
