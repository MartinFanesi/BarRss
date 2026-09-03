/**
 * BarRSS - Base de datos de Canales RSS por País y Temática
 * Contiene el catálogo completo de América Latina e Internacional.
 */

var COUNTRY_CATALOG = {
  "Regional / Internacional": {
    "country": "Regional / Internacional",
    "flag": "🌍",
    "lang": "es",
    "categories": {
      "General": [
        {
          "id": "reg_gen_1",
          "name": "BBC Mundo",
          "category": "General",
          "country": "Regional / Internacional",
          "countryFlag": "🌍",
          "lang": "es",
          "url": "https://feeds.bbci.co.uk/mundo/rss.xml",
          "domain": "feeds.bbci.co.uk",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "reg_gen_2",
          "name": "DW Español",
          "category": "General",
          "country": "Regional / Internacional",
          "countryFlag": "🌍",
          "lang": "es",
          "url": "https://rss.dw.com/xml/rss-sp-all",
          "domain": "rss.dw.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "reg_gen_3",
          "name": "CNN en Español",
          "category": "General",
          "country": "Regional / Internacional",
          "countryFlag": "🌍",
          "lang": "es",
          "url": "https://cnnespanol.cnn.com/feed/",
          "domain": "cnnespanol.cnn.com",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Economía": [
        {
          "id": "reg_eco_4",
          "name": "AméricaEconomía",
          "category": "Economía",
          "country": "Regional / Internacional",
          "countryFlag": "🌍",
          "lang": "es",
          "url": "https://www.americaeconomia.com/feed",
          "domain": "americaeconomia.com",
          "enabled": false,
          "isCustom": false
        }
      ]
    }
  },
  "Argentina": {
    "country": "Argentina",
    "flag": "🇦🇷",
    "lang": "es",
    "categories": {
      "General": [
        {
          "id": "arg_gen_5",
          "name": "La Nación - Últimas noticias",
          "category": "General",
          "country": "Argentina",
          "countryFlag": "🇦🇷",
          "lang": "es",
          "url": "https://www.lanacion.com.ar/arc/outboundfeeds/rss/",
          "domain": "lanacion.com.ar",
          "enabled": true,
          "isCustom": false
        },
        {
          "id": "arg_gen_6",
          "name": "Clarín - Último momento",
          "category": "General",
          "country": "Argentina",
          "countryFlag": "🇦🇷",
          "lang": "es",
          "url": "https://www.clarin.com/rss/lo-ultimo/",
          "domain": "clarin.com",
          "enabled": true,
          "isCustom": false
        },
        {
          "id": "arg_gen_7",
          "name": "Infobae",
          "category": "General",
          "country": "Argentina",
          "countryFlag": "🇦🇷",
          "lang": "es",
          "url": "https://www.infobae.com/arc/outboundfeeds/rss/",
          "domain": "infobae.com",
          "enabled": true,
          "isCustom": false
        },
        {
          "id": "arg_gen_8",
          "name": "Perfil - Últimas noticias",
          "category": "General",
          "country": "Argentina",
          "countryFlag": "🇦🇷",
          "lang": "es",
          "url": "https://www.perfil.com/feed",
          "domain": "pagina12.com.ar",
          "enabled": true,
          "isCustom": false
        }
      ],
      "Política": [
        {
          "id": "arg_pol_9",
          "name": "La Nación - Política",
          "category": "Política",
          "country": "Argentina",
          "countryFlag": "🇦🇷",
          "lang": "es",
          "url": "https://www.lanacion.com.ar/rss/politica/",
          "domain": "lanacion.com.ar",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "arg_pol_10",
          "name": "Clarín - Política",
          "category": "Política",
          "country": "Argentina",
          "countryFlag": "🇦🇷",
          "lang": "es",
          "url": "https://www.clarin.com/rss/politica/",
          "domain": "clarin.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "arg_pol_11",
          "name": "Página/12 - El País",
          "category": "Política",
          "country": "Argentina",
          "countryFlag": "🇦🇷",
          "lang": "es",
          "url": "https://www.pagina12.com.ar/rss/el-pais.xml",
          "domain": "pagina12.com.ar",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Economía": [
        {
          "id": "arg_eco_12",
          "name": "La Nación - Economía",
          "category": "Economía",
          "country": "Argentina",
          "countryFlag": "🇦🇷",
          "lang": "es",
          "url": "https://www.lanacion.com.ar/rss/economia/",
          "domain": "lanacion.com.ar",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "arg_eco_13",
          "name": "Clarín - Economía",
          "category": "Economía",
          "country": "Argentina",
          "countryFlag": "🇦🇷",
          "lang": "es",
          "url": "https://www.clarin.com/rss/economia/",
          "domain": "clarin.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "arg_eco_14",
          "name": "Ámbito - Economía",
          "category": "Economía",
          "country": "Argentina",
          "countryFlag": "🇦🇷",
          "lang": "es",
          "url": "https://www.ambito.com/rss/economia/",
          "domain": "ambito.com",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Deportes": [
        {
          "id": "arg_dep_15",
          "name": "La Nación - Deportes",
          "category": "Deportes",
          "country": "Argentina",
          "countryFlag": "🇦🇷",
          "lang": "es",
          "url": "https://www.lanacion.com.ar/rss/deportes/",
          "domain": "lanacion.com.ar",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "arg_dep_16",
          "name": "Clarín - Deportes",
          "category": "Deportes",
          "country": "Argentina",
          "countryFlag": "🇦🇷",
          "lang": "es",
          "url": "https://www.clarin.com/rss/deportes/",
          "domain": "clarin.com",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Tecnología": [
        {
          "id": "arg_tec_17",
          "name": "La Nación - Tecnología",
          "category": "Tecnología",
          "country": "Argentina",
          "countryFlag": "🇦🇷",
          "lang": "es",
          "url": "https://www.lanacion.com.ar/rss/tecnologia/",
          "domain": "lanacion.com.ar",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "arg_tec_18",
          "name": "Clarín - Tecnología",
          "category": "Tecnología",
          "country": "Argentina",
          "countryFlag": "🇦🇷",
          "lang": "es",
          "url": "https://www.clarin.com/rss/tecnologia/",
          "domain": "clarin.com",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Cultura": [
        {
          "id": "arg_cul_19",
          "name": "La Nación - Cultura",
          "category": "Cultura",
          "country": "Argentina",
          "countryFlag": "🇦🇷",
          "lang": "es",
          "url": "https://www.lanacion.com.ar/rss/cultura/",
          "domain": "lanacion.com.ar",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "arg_cul_20",
          "name": "Clarín - Cultura",
          "category": "Cultura",
          "country": "Argentina",
          "countryFlag": "🇦🇷",
          "lang": "es",
          "url": "https://www.clarin.com/rss/cultura/",
          "domain": "clarin.com",
          "enabled": false,
          "isCustom": false
        }
      ]
    }
  },
  "Bolivia": {
    "country": "Bolivia",
    "flag": "🇧🇴",
    "lang": "es",
    "categories": {
      "General": [
        {
          "id": "bol_gen_21",
          "name": "El Deber",
          "category": "General",
          "country": "Bolivia",
          "countryFlag": "🇧🇴",
          "lang": "es",
          "url": "https://eldeber.com.bo/feed/",
          "domain": "eldeber.com.bo",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "bol_gen_22",
          "name": "Los Tiempos",
          "category": "General",
          "country": "Bolivia",
          "countryFlag": "🇧🇴",
          "lang": "es",
          "url": "https://www.lostiempos.com/feed/",
          "domain": "lostiempos.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "bol_gen_23",
          "name": "Página Siete",
          "category": "General",
          "country": "Bolivia",
          "countryFlag": "🇧🇴",
          "lang": "es",
          "url": "https://www.paginasiete.bo/feed/",
          "domain": "paginasiete.bo",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "bol_gen_24",
          "name": "Brújula Digital",
          "category": "General",
          "country": "Bolivia",
          "countryFlag": "🇧🇴",
          "lang": "es",
          "url": "https://brujuladigital.net/feed/",
          "domain": "brujuladigital.net",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Política": [
        {
          "id": "bol_pol_25",
          "name": "Página Siete - Política",
          "category": "Política",
          "country": "Bolivia",
          "countryFlag": "🇧🇴",
          "lang": "es",
          "url": "https://www.paginasiete.bo/category/politica/feed/",
          "domain": "paginasiete.bo",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "bol_pol_26",
          "name": "Brújula Digital - Política",
          "category": "Política",
          "country": "Bolivia",
          "countryFlag": "🇧🇴",
          "lang": "es",
          "url": "https://brujuladigital.net/category/politica/feed/",
          "domain": "brujuladigital.net",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Economía": [
        {
          "id": "bol_eco_27",
          "name": "Página Siete - Economía",
          "category": "Economía",
          "country": "Bolivia",
          "countryFlag": "🇧🇴",
          "lang": "es",
          "url": "https://www.paginasiete.bo/category/economia/feed/",
          "domain": "paginasiete.bo",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Deportes": [
        {
          "id": "bol_dep_28",
          "name": "Página Siete - Deportes",
          "category": "Deportes",
          "country": "Bolivia",
          "countryFlag": "🇧🇴",
          "lang": "es",
          "url": "https://www.paginasiete.bo/category/deportes/feed/",
          "domain": "paginasiete.bo",
          "enabled": false,
          "isCustom": false
        }
      ]
    }
  },
  "Brasil": {
    "country": "Brasil",
    "flag": "🇧🇷",
    "lang": "pt",
    "categories": {
      "General": [
        {
          "id": "bra_gen_29",
          "name": "Folha de S.Paulo",
          "category": "General",
          "country": "Brasil",
          "countryFlag": "🇧🇷",
          "lang": "pt",
          "url": "https://feeds.folha.uol.com.br/folha/rss.xml",
          "domain": "feeds.folha.uol.com.br",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "bra_gen_30",
          "name": "G1",
          "category": "General",
          "country": "Brasil",
          "countryFlag": "🇧🇷",
          "lang": "pt",
          "url": "https://g1.globo.com/rss/g1.xml",
          "domain": "g1.globo.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "bra_gen_31",
          "name": "CNN Brasil",
          "category": "General",
          "country": "Brasil",
          "countryFlag": "🇧🇷",
          "lang": "pt",
          "url": "https://www.cnnbrasil.com.br/feed/",
          "domain": "cnnbrasil.com.br",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Política": [
        {
          "id": "bra_pol_32",
          "name": "Folha - Poder",
          "category": "Política",
          "country": "Brasil",
          "countryFlag": "🇧🇷",
          "lang": "pt",
          "url": "https://feeds.folha.uol.com.br/poder/rss.xml",
          "domain": "feeds.folha.uol.com.br",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "bra_pol_33",
          "name": "G1 - Política",
          "category": "Política",
          "country": "Brasil",
          "countryFlag": "🇧🇷",
          "lang": "pt",
          "url": "https://g1.globo.com/rss/g1/politica/",
          "domain": "g1.globo.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "bra_pol_34",
          "name": "CNN Brasil - Política",
          "category": "Política",
          "country": "Brasil",
          "countryFlag": "🇧🇷",
          "lang": "pt",
          "url": "https://www.cnnbrasil.com.br/category/politica/feed/",
          "domain": "cnnbrasil.com.br",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Economía": [
        {
          "id": "bra_eco_35",
          "name": "Folha - Mercado",
          "category": "Economía",
          "country": "Brasil",
          "countryFlag": "🇧🇷",
          "lang": "pt",
          "url": "https://feeds.folha.uol.com.br/mercado/rss.xml",
          "domain": "feeds.folha.uol.com.br",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "bra_eco_36",
          "name": "G1 - Economía",
          "category": "Economía",
          "country": "Brasil",
          "countryFlag": "🇧🇷",
          "lang": "pt",
          "url": "https://g1.globo.com/rss/g1/economia/",
          "domain": "g1.globo.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "bra_eco_37",
          "name": "CNN Brasil - Economía",
          "category": "Economía",
          "country": "Brasil",
          "countryFlag": "🇧🇷",
          "lang": "pt",
          "url": "https://www.cnnbrasil.com.br/category/economia/feed/",
          "domain": "cnnbrasil.com.br",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Deportes": [
        {
          "id": "bra_dep_38",
          "name": "Folha - Esporte",
          "category": "Deportes",
          "country": "Brasil",
          "countryFlag": "🇧🇷",
          "lang": "pt",
          "url": "https://feeds.folha.uol.com.br/esporte/rss.xml",
          "domain": "feeds.folha.uol.com.br",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Tecnología": [
        {
          "id": "bra_tec_39",
          "name": "Folha - Tec",
          "category": "Tecnología",
          "country": "Brasil",
          "countryFlag": "🇧🇷",
          "lang": "pt",
          "url": "https://feeds.folha.uol.com.br/tec/rss.xml",
          "domain": "feeds.folha.uol.com.br",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "bra_tec_40",
          "name": "G1 - Tecnología",
          "category": "Tecnología",
          "country": "Brasil",
          "countryFlag": "🇧🇷",
          "lang": "pt",
          "url": "https://g1.globo.com/rss/g1/tecnologia/",
          "domain": "g1.globo.com",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Cultura": [
        {
          "id": "bra_cul_41",
          "name": "Folha - Ilustrada",
          "category": "Cultura",
          "country": "Brasil",
          "countryFlag": "🇧🇷",
          "lang": "pt",
          "url": "https://feeds.folha.uol.com.br/ilustrada/rss.xml",
          "domain": "feeds.folha.uol.com.br",
          "enabled": false,
          "isCustom": false
        }
      ]
    }
  },
  "Chile": {
    "country": "Chile",
    "flag": "🇨🇱",
    "lang": "es",
    "categories": {
      "General": [
        {
          "id": "chi_gen_42",
          "name": "La Tercera",
          "category": "General",
          "country": "Chile",
          "countryFlag": "🇨🇱",
          "lang": "es",
          "url": "https://www.latercera.com/arc/outboundfeeds/rss/",
          "domain": "latercera.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "chi_gen_43",
          "name": "Emol",
          "category": "General",
          "country": "Chile",
          "countryFlag": "🇨🇱",
          "lang": "es",
          "url": "https://www.emol.com/rss/",
          "domain": "emol.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "chi_gen_44",
          "name": "Cooperativa - Últimas noticias",
          "category": "General",
          "country": "Chile",
          "countryFlag": "🇨🇱",
          "lang": "es",
          "url": "https://www.cooperativa.cl/rss/ultimas-noticias/",
          "domain": "cooperativa.cl",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "chi_gen_45",
          "name": "BioBioChile - Últimas noticias",
          "category": "General",
          "country": "Chile",
          "countryFlag": "🇨🇱",
          "lang": "es",
          "url": "https://www.biobiochile.cl/rss/ultimas-noticias.xml",
          "domain": "biobiochile.cl",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "chi_gen_46",
          "name": "El Mostrador",
          "category": "General",
          "country": "Chile",
          "countryFlag": "🇨🇱",
          "lang": "es",
          "url": "https://www.elmostrador.cl/feed/",
          "domain": "elmostrador.cl",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Política": [
        {
          "id": "chi_pol_47",
          "name": "Emol - Nacional",
          "category": "Política",
          "country": "Chile",
          "countryFlag": "🇨🇱",
          "lang": "es",
          "url": "https://www.emol.com/rss/nacional/",
          "domain": "emol.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "chi_pol_48",
          "name": "El Mostrador - Política",
          "category": "Política",
          "country": "Chile",
          "countryFlag": "🇨🇱",
          "lang": "es",
          "url": "https://www.elmostrador.cl/category/politica/feed/",
          "domain": "elmostrador.cl",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Economía": [
        {
          "id": "chi_eco_49",
          "name": "Emol - Economía",
          "category": "Economía",
          "country": "Chile",
          "countryFlag": "🇨🇱",
          "lang": "es",
          "url": "https://www.emol.com/rss/economia/",
          "domain": "emol.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "chi_eco_50",
          "name": "Cooperativa - Economía",
          "category": "Economía",
          "country": "Chile",
          "countryFlag": "🇨🇱",
          "lang": "es",
          "url": "https://www.cooperativa.cl/rss/economia/",
          "domain": "cooperativa.cl",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Deportes": [
        {
          "id": "chi_dep_51",
          "name": "Emol - Deportes",
          "category": "Deportes",
          "country": "Chile",
          "countryFlag": "🇨🇱",
          "lang": "es",
          "url": "https://www.emol.com/rss/deportes/",
          "domain": "emol.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "chi_dep_52",
          "name": "Cooperativa - Deportes",
          "category": "Deportes",
          "country": "Chile",
          "countryFlag": "🇨🇱",
          "lang": "es",
          "url": "https://www.cooperativa.cl/rss/deportes/",
          "domain": "cooperativa.cl",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Tecnología": [
        {
          "id": "chi_tec_53",
          "name": "Emol - Tecnología",
          "category": "Tecnología",
          "country": "Chile",
          "countryFlag": "🇨🇱",
          "lang": "es",
          "url": "https://www.emol.com/rss/tecnologia/",
          "domain": "emol.com",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Cultura": [
        {
          "id": "chi_cul_54",
          "name": "Emol - Cultura",
          "category": "Cultura",
          "country": "Chile",
          "countryFlag": "🇨🇱",
          "lang": "es",
          "url": "https://www.emol.com/rss/cultura/",
          "domain": "emol.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "chi_cul_55",
          "name": "El Mostrador - Cultura",
          "category": "Cultura",
          "country": "Chile",
          "countryFlag": "🇨🇱",
          "lang": "es",
          "url": "https://www.elmostrador.cl/category/cultura/feed/",
          "domain": "elmostrador.cl",
          "enabled": false,
          "isCustom": false
        }
      ]
    }
  },
  "Colombia": {
    "country": "Colombia",
    "flag": "🇨🇴",
    "lang": "es",
    "categories": {
      "General": [
        {
          "id": "col_gen_56",
          "name": "El Tiempo",
          "category": "General",
          "country": "Colombia",
          "countryFlag": "🇨🇴",
          "lang": "es",
          "url": "https://www.eltiempo.com/arc/outboundfeeds/rss/",
          "domain": "eltiempo.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "col_gen_57",
          "name": "El Espectador",
          "category": "General",
          "country": "Colombia",
          "countryFlag": "🇨🇴",
          "lang": "es",
          "url": "https://www.elespectador.com/arc/outboundfeeds/rss/",
          "domain": "elespectador.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "col_gen_58",
          "name": "Semana",
          "category": "General",
          "country": "Colombia",
          "countryFlag": "🇨🇴",
          "lang": "es",
          "url": "https://www.semana.com/feed/",
          "domain": "semana.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "col_gen_59",
          "name": "La Silla Vacía",
          "category": "General",
          "country": "Colombia",
          "countryFlag": "🇨🇴",
          "lang": "es",
          "url": "https://www.lasillavacia.com/feed/",
          "domain": "lasillavacia.com",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Política": [
        {
          "id": "col_pol_60",
          "name": "Semana - Política",
          "category": "Política",
          "country": "Colombia",
          "countryFlag": "🇨🇴",
          "lang": "es",
          "url": "https://www.semana.com/category/politica/feed/",
          "domain": "semana.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "col_pol_61",
          "name": "La Silla Vacía - Política",
          "category": "Política",
          "country": "Colombia",
          "countryFlag": "🇨🇴",
          "lang": "es",
          "url": "https://www.lasillavacia.com/category/politica/feed/",
          "domain": "lasillavacia.com",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Economía": [
        {
          "id": "col_eco_62",
          "name": "Valora Analitik - Economía",
          "category": "Economía",
          "country": "Colombia",
          "countryFlag": "🇨🇴",
          "lang": "es",
          "url": "https://www.valoraanalitik.com/category/economia/feed/",
          "domain": "valoraanalitik.com",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Deportes": [
        {
          "id": "col_dep_63",
          "name": "Semana - Deportes",
          "category": "Deportes",
          "country": "Colombia",
          "countryFlag": "🇨🇴",
          "lang": "es",
          "url": "https://www.semana.com/category/deportes/feed/",
          "domain": "semana.com",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Tecnología": [
        {
          "id": "col_tec_64",
          "name": "Semana - Tecnología",
          "category": "Tecnología",
          "country": "Colombia",
          "countryFlag": "🇨🇴",
          "lang": "es",
          "url": "https://www.semana.com/category/tecnologia/feed/",
          "domain": "semana.com",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Cultura": [
        {
          "id": "col_cul_65",
          "name": "Semana - Cultura",
          "category": "Cultura",
          "country": "Colombia",
          "countryFlag": "🇨🇴",
          "lang": "es",
          "url": "https://www.semana.com/category/cultura/feed/",
          "domain": "semana.com",
          "enabled": false,
          "isCustom": false
        }
      ]
    }
  },
  "Costa Rica": {
    "country": "Costa Rica",
    "flag": "🇨🇷",
    "lang": "es",
    "categories": {
      "General": [
        {
          "id": "cos_gen_66",
          "name": "La Nación",
          "category": "General",
          "country": "Costa Rica",
          "countryFlag": "🇨🇷",
          "lang": "es",
          "url": "https://www.nacion.com/arc/outboundfeeds/rss/",
          "domain": "nacion.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "cos_gen_67",
          "name": "Amelia Rueda",
          "category": "General",
          "country": "Costa Rica",
          "countryFlag": "🇨🇷",
          "lang": "es",
          "url": "https://www.ameliarueda.com/feed/",
          "domain": "ameliarueda.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "cos_gen_68",
          "name": "CRHoy",
          "category": "General",
          "country": "Costa Rica",
          "countryFlag": "🇨🇷",
          "lang": "es",
          "url": "https://www.crhoy.com/feed/",
          "domain": "crhoy.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "cos_gen_69",
          "name": "El Financiero",
          "category": "General",
          "country": "Costa Rica",
          "countryFlag": "🇨🇷",
          "lang": "es",
          "url": "https://www.elfinancierocr.com/feed/",
          "domain": "elfinancierocr.com",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Política": [
        {
          "id": "cos_pol_70",
          "name": "Amelia Rueda - Política",
          "category": "Política",
          "country": "Costa Rica",
          "countryFlag": "🇨🇷",
          "lang": "es",
          "url": "https://www.ameliarueda.com/category/politica/feed/",
          "domain": "ameliarueda.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "cos_pol_71",
          "name": "CRHoy - Política",
          "category": "Política",
          "country": "Costa Rica",
          "countryFlag": "🇨🇷",
          "lang": "es",
          "url": "https://www.crhoy.com/category/politica/feed/",
          "domain": "crhoy.com",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Economía": [
        {
          "id": "cos_eco_72",
          "name": "El Financiero - Economía",
          "category": "Economía",
          "country": "Costa Rica",
          "countryFlag": "🇨🇷",
          "lang": "es",
          "url": "https://www.elfinancierocr.com/category/economia/feed/",
          "domain": "elfinancierocr.com",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Deportes": [
        {
          "id": "cos_dep_73",
          "name": "CRHoy - Deportes",
          "category": "Deportes",
          "country": "Costa Rica",
          "countryFlag": "🇨🇷",
          "lang": "es",
          "url": "https://www.crhoy.com/category/deportes/feed/",
          "domain": "crhoy.com",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Tecnología": [
        {
          "id": "cos_tec_74",
          "name": "CRHoy - Tecnología",
          "category": "Tecnología",
          "country": "Costa Rica",
          "countryFlag": "🇨🇷",
          "lang": "es",
          "url": "https://www.crhoy.com/category/tecnologia/feed/",
          "domain": "crhoy.com",
          "enabled": false,
          "isCustom": false
        }
      ]
    }
  },
  "Cuba": {
    "country": "Cuba",
    "flag": "🇨🇺",
    "lang": "es",
    "categories": {
      "General": [
        {
          "id": "cub_gen_75",
          "name": "Cubadebate",
          "category": "General",
          "country": "Cuba",
          "countryFlag": "🇨🇺",
          "lang": "es",
          "url": "https://www.cubadebate.cu/feed/",
          "domain": "cubadebate.cu",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "cub_gen_76",
          "name": "14ymedio",
          "category": "General",
          "country": "Cuba",
          "countryFlag": "🇨🇺",
          "lang": "es",
          "url": "https://www.14ymedio.com/feed/",
          "domain": "14ymedio.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "cub_gen_77",
          "name": "El Toque",
          "category": "General",
          "country": "Cuba",
          "countryFlag": "🇨🇺",
          "lang": "es",
          "url": "https://eltoque.com/feed/",
          "domain": "eltoque.com",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Política": [
        {
          "id": "cub_pol_78",
          "name": "Cubadebate - Política",
          "category": "Política",
          "country": "Cuba",
          "countryFlag": "🇨🇺",
          "lang": "es",
          "url": "https://www.cubadebate.cu/category/politica/feed/",
          "domain": "cubadebate.cu",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "cub_pol_79",
          "name": "14ymedio - Política",
          "category": "Política",
          "country": "Cuba",
          "countryFlag": "🇨🇺",
          "lang": "es",
          "url": "https://www.14ymedio.com/category/politica/feed/",
          "domain": "14ymedio.com",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Economía": [
        {
          "id": "cub_eco_80",
          "name": "Cubadebate - Economía",
          "category": "Economía",
          "country": "Cuba",
          "countryFlag": "🇨🇺",
          "lang": "es",
          "url": "https://www.cubadebate.cu/category/economia/feed/",
          "domain": "cubadebate.cu",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "cub_eco_81",
          "name": "El Toque - Economía",
          "category": "Economía",
          "country": "Cuba",
          "countryFlag": "🇨🇺",
          "lang": "es",
          "url": "https://eltoque.com/category/economia/feed/",
          "domain": "eltoque.com",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Cultura": [
        {
          "id": "cub_cul_82",
          "name": "Cubadebate - Cultura",
          "category": "Cultura",
          "country": "Cuba",
          "countryFlag": "🇨🇺",
          "lang": "es",
          "url": "https://www.cubadebate.cu/category/cultura/feed/",
          "domain": "cubadebate.cu",
          "enabled": false,
          "isCustom": false
        }
      ]
    }
  },
  "Ecuador": {
    "country": "Ecuador",
    "flag": "🇪🇨",
    "lang": "es",
    "categories": {
      "General": [
        {
          "id": "ecu_gen_83",
          "name": "El Universo",
          "category": "General",
          "country": "Ecuador",
          "countryFlag": "🇪🇨",
          "lang": "es",
          "url": "https://www.eluniverso.com/arc/outboundfeeds/rss/",
          "domain": "eluniverso.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "ecu_gen_84",
          "name": "El Comercio",
          "category": "General",
          "country": "Ecuador",
          "countryFlag": "🇪🇨",
          "lang": "es",
          "url": "https://www.elcomercio.com/feed/",
          "domain": "elcomercio.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "ecu_gen_85",
          "name": "Primicias",
          "category": "General",
          "country": "Ecuador",
          "countryFlag": "🇪🇨",
          "lang": "es",
          "url": "https://www.primicias.ec/feed/",
          "domain": "primicias.ec",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "ecu_gen_86",
          "name": "GK",
          "category": "General",
          "country": "Ecuador",
          "countryFlag": "🇪🇨",
          "lang": "es",
          "url": "https://gk.city/feed/",
          "domain": "gk.city",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Política": [
        {
          "id": "ecu_pol_87",
          "name": "Primicias - Política",
          "category": "Política",
          "country": "Ecuador",
          "countryFlag": "🇪🇨",
          "lang": "es",
          "url": "https://www.primicias.ec/category/politica/feed/",
          "domain": "primicias.ec",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "ecu_pol_88",
          "name": "El Comercio - Política",
          "category": "Política",
          "country": "Ecuador",
          "countryFlag": "🇪🇨",
          "lang": "es",
          "url": "https://www.elcomercio.com/category/politica/feed/",
          "domain": "elcomercio.com",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Economía": [
        {
          "id": "ecu_eco_89",
          "name": "Primicias - Economía",
          "category": "Economía",
          "country": "Ecuador",
          "countryFlag": "🇪🇨",
          "lang": "es",
          "url": "https://www.primicias.ec/category/economia/feed/",
          "domain": "primicias.ec",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Deportes": [
        {
          "id": "ecu_dep_90",
          "name": "Primicias - Deportes",
          "category": "Deportes",
          "country": "Ecuador",
          "countryFlag": "🇪🇨",
          "lang": "es",
          "url": "https://www.primicias.ec/category/deportes/feed/",
          "domain": "primicias.ec",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Tecnología": [
        {
          "id": "ecu_tec_91",
          "name": "GK - Tecnología",
          "category": "Tecnología",
          "country": "Ecuador",
          "countryFlag": "🇪🇨",
          "lang": "es",
          "url": "https://gk.city/category/tecnologia/feed/",
          "domain": "gk.city",
          "enabled": false,
          "isCustom": false
        }
      ]
    }
  },
  "El Salvador": {
    "country": "El Salvador",
    "flag": "🇸🇻",
    "lang": "es",
    "categories": {
      "General": [
        {
          "id": "el _gen_92",
          "name": "El Faro",
          "category": "General",
          "country": "El Salvador",
          "countryFlag": "🇸🇻",
          "lang": "es",
          "url": "https://elfaro.net/feed/",
          "domain": "elfaro.net",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "el _gen_93",
          "name": "GatoEncerrado",
          "category": "General",
          "country": "El Salvador",
          "countryFlag": "🇸🇻",
          "lang": "es",
          "url": "https://revistagatoencerrado.net/feed/",
          "domain": "revistagatoencerrado.net",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "el _gen_94",
          "name": "La Prensa Gráfica",
          "category": "General",
          "country": "El Salvador",
          "countryFlag": "🇸🇻",
          "lang": "es",
          "url": "https://www.laprensagrafica.com/rss/ultimas-noticias/",
          "domain": "laprensagrafica.com",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Política": [
        {
          "id": "el _pol_95",
          "name": "El Faro - Política",
          "category": "Política",
          "country": "El Salvador",
          "countryFlag": "🇸🇻",
          "lang": "es",
          "url": "https://elfaro.net/category/politica/feed/",
          "domain": "elfaro.net",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "el _pol_96",
          "name": "GatoEncerrado - Política",
          "category": "Política",
          "country": "El Salvador",
          "countryFlag": "🇸🇻",
          "lang": "es",
          "url": "https://revistagatoencerrado.net/category/politica/feed/",
          "domain": "revistagatoencerrado.net",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Cultura": [
        {
          "id": "el _cul_97",
          "name": "GatoEncerrado - Cultura",
          "category": "Cultura",
          "country": "El Salvador",
          "countryFlag": "🇸🇻",
          "lang": "es",
          "url": "https://revistagatoencerrado.net/category/cultura/feed/",
          "domain": "revistagatoencerrado.net",
          "enabled": false,
          "isCustom": false
        }
      ]
    }
  },
  "Guatemala": {
    "country": "Guatemala",
    "flag": "🇬🇹",
    "lang": "es",
    "categories": {
      "General": [
        {
          "id": "gua_gen_98",
          "name": "Prensa Libre",
          "category": "General",
          "country": "Guatemala",
          "countryFlag": "🇬🇹",
          "lang": "es",
          "url": "https://www.prensalibre.com/arc/outboundfeeds/rss/",
          "domain": "prensalibre.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "gua_gen_99",
          "name": "elPeriódico",
          "category": "General",
          "country": "Guatemala",
          "countryFlag": "🇬🇹",
          "lang": "es",
          "url": "https://elperiodico.com.gt/feed/",
          "domain": "elperiodico.com.gt",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "gua_gen_100",
          "name": "Plaza Pública",
          "category": "General",
          "country": "Guatemala",
          "countryFlag": "🇬🇹",
          "lang": "es",
          "url": "https://www.plazapublica.com.gt/feed/",
          "domain": "plazapublica.com.gt",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "gua_gen_101",
          "name": "Soy502",
          "category": "General",
          "country": "Guatemala",
          "countryFlag": "🇬🇹",
          "lang": "es",
          "url": "https://www.soy502.com/feed/",
          "domain": "soy502.com",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Política": [
        {
          "id": "gua_pol_102",
          "name": "elPeriódico - Política",
          "category": "Política",
          "country": "Guatemala",
          "countryFlag": "🇬🇹",
          "lang": "es",
          "url": "https://elperiodico.com.gt/category/politica/feed/",
          "domain": "elperiodico.com.gt",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "gua_pol_103",
          "name": "Plaza Pública - Política",
          "category": "Política",
          "country": "Guatemala",
          "countryFlag": "🇬🇹",
          "lang": "es",
          "url": "https://www.plazapublica.com.gt/category/politica/feed/",
          "domain": "plazapublica.com.gt",
          "enabled": false,
          "isCustom": false
        }
      ]
    }
  },
  "Honduras": {
    "country": "Honduras",
    "flag": "🇭🇳",
    "lang": "es",
    "categories": {
      "General": [
        {
          "id": "hon_gen_104",
          "name": "Confidencial Honduras",
          "category": "General",
          "country": "Honduras",
          "countryFlag": "🇭🇳",
          "lang": "es",
          "url": "https://confidencial.hn/feed/",
          "domain": "confidencial.hn",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "hon_gen_105",
          "name": "La Prensa",
          "category": "General",
          "country": "Honduras",
          "countryFlag": "🇭🇳",
          "lang": "es",
          "url": "https://www.laprensa.hn/rss/ultimas-noticias/",
          "domain": "laprensa.hn",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Política": [
        {
          "id": "hon_pol_106",
          "name": "Confidencial Honduras - Política",
          "category": "Política",
          "country": "Honduras",
          "countryFlag": "🇭🇳",
          "lang": "es",
          "url": "https://confidencial.hn/category/politica/feed/",
          "domain": "confidencial.hn",
          "enabled": false,
          "isCustom": false
        }
      ]
    }
  },
  "México": {
    "country": "México",
    "flag": "🇲🇽",
    "lang": "es",
    "categories": {
      "General": [
        {
          "id": "méx_gen_107",
          "name": "Animal Político",
          "category": "General",
          "country": "México",
          "countryFlag": "🇲🇽",
          "lang": "es",
          "url": "https://www.animalpolitico.com/feed/",
          "domain": "animalpolitico.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "méx_gen_108",
          "name": "Aristegui Noticias",
          "category": "General",
          "country": "México",
          "countryFlag": "🇲🇽",
          "lang": "es",
          "url": "https://aristeguinoticias.com/feed/",
          "domain": "aristeguinoticias.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "méx_gen_109",
          "name": "SinEmbargo",
          "category": "General",
          "country": "México",
          "countryFlag": "🇲🇽",
          "lang": "es",
          "url": "https://www.sinembargo.mx/feed/",
          "domain": "sinembargo.mx",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "méx_gen_110",
          "name": "Proceso",
          "category": "General",
          "country": "México",
          "countryFlag": "🇲🇽",
          "lang": "es",
          "url": "https://www.proceso.com.mx/feed/",
          "domain": "proceso.com.mx",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "méx_gen_111",
          "name": "La Jornada - Portada",
          "category": "General",
          "country": "México",
          "countryFlag": "🇲🇽",
          "lang": "es",
          "url": "https://www.jornada.com.mx/rss/portada.xml",
          "domain": "jornada.com.mx",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Política": [
        {
          "id": "méx_pol_112",
          "name": "Animal Político - Política",
          "category": "Política",
          "country": "México",
          "countryFlag": "🇲🇽",
          "lang": "es",
          "url": "https://www.animalpolitico.com/category/politica/feed/",
          "domain": "animalpolitico.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "méx_pol_113",
          "name": "Aristegui Noticias - Política",
          "category": "Política",
          "country": "México",
          "countryFlag": "🇲🇽",
          "lang": "es",
          "url": "https://aristeguinoticias.com/category/politica/feed/",
          "domain": "aristeguinoticias.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "méx_pol_114",
          "name": "Proceso - Política",
          "category": "Política",
          "country": "México",
          "countryFlag": "🇲🇽",
          "lang": "es",
          "url": "https://www.proceso.com.mx/category/politica/feed/",
          "domain": "proceso.com.mx",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "méx_pol_115",
          "name": "La Jornada - Política",
          "category": "Política",
          "country": "México",
          "countryFlag": "🇲🇽",
          "lang": "es",
          "url": "https://www.jornada.com.mx/rss/politica.xml",
          "domain": "jornada.com.mx",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Economía": [
        {
          "id": "méx_eco_116",
          "name": "El Economista",
          "category": "Economía",
          "country": "México",
          "countryFlag": "🇲🇽",
          "lang": "es",
          "url": "https://www.eleconomista.com.mx/rss/ultimas-noticias/",
          "domain": "eleconomista.com.mx",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "méx_eco_117",
          "name": "La Jornada - Economía",
          "category": "Economía",
          "country": "México",
          "countryFlag": "🇲🇽",
          "lang": "es",
          "url": "https://www.jornada.com.mx/rss/economia.xml",
          "domain": "jornada.com.mx",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Deportes": [
        {
          "id": "méx_dep_118",
          "name": "La Jornada - Deportes",
          "category": "Deportes",
          "country": "México",
          "countryFlag": "🇲🇽",
          "lang": "es",
          "url": "https://www.jornada.com.mx/rss/deportes.xml",
          "domain": "jornada.com.mx",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "méx_dep_119",
          "name": "Animal Político - Deportes",
          "category": "Deportes",
          "country": "México",
          "countryFlag": "🇲🇽",
          "lang": "es",
          "url": "https://www.animalpolitico.com/category/deportes/feed/",
          "domain": "animalpolitico.com",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Tecnología": [
        {
          "id": "méx_tec_120",
          "name": "Proceso - Tecnología",
          "category": "Tecnología",
          "country": "México",
          "countryFlag": "🇲🇽",
          "lang": "es",
          "url": "https://www.proceso.com.mx/category/tecnologia/feed/",
          "domain": "proceso.com.mx",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Cultura": [
        {
          "id": "méx_cul_121",
          "name": "La Jornada - Cultura",
          "category": "Cultura",
          "country": "México",
          "countryFlag": "🇲🇽",
          "lang": "es",
          "url": "https://www.jornada.com.mx/rss/cultura.xml",
          "domain": "jornada.com.mx",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "méx_cul_122",
          "name": "Proceso - Cultura",
          "category": "Cultura",
          "country": "México",
          "countryFlag": "🇲🇽",
          "lang": "es",
          "url": "https://www.proceso.com.mx/category/cultura/feed/",
          "domain": "proceso.com.mx",
          "enabled": false,
          "isCustom": false
        }
      ]
    }
  },
  "Nicaragua": {
    "country": "Nicaragua",
    "flag": "🇳🇮",
    "lang": "es",
    "categories": {
      "General": [
        {
          "id": "nic_gen_123",
          "name": "Confidencial",
          "category": "General",
          "country": "Nicaragua",
          "countryFlag": "🇳🇮",
          "lang": "es",
          "url": "https://confidencial.digital/feed/",
          "domain": "confidencial.digital",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "nic_gen_124",
          "name": "La Prensa",
          "category": "General",
          "country": "Nicaragua",
          "countryFlag": "🇳🇮",
          "lang": "es",
          "url": "https://www.laprensa.com.ni/rss/ultimas-noticias/",
          "domain": "laprensa.com.ni",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Política": [
        {
          "id": "nic_pol_125",
          "name": "Confidencial - Política",
          "category": "Política",
          "country": "Nicaragua",
          "countryFlag": "🇳🇮",
          "lang": "es",
          "url": "https://confidencial.digital/category/politica/feed/",
          "domain": "confidencial.digital",
          "enabled": false,
          "isCustom": false
        }
      ]
    }
  },
  "Panamá": {
    "country": "Panamá",
    "flag": "🇵🇦",
    "lang": "es",
    "categories": {
      "General": [
        {
          "id": "pan_gen_126",
          "name": "La Prensa",
          "category": "General",
          "country": "Panamá",
          "countryFlag": "🇵🇦",
          "lang": "es",
          "url": "https://www.prensa.com/arc/outboundfeeds/rss/",
          "domain": "prensa.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "pan_gen_127",
          "name": "Crítica",
          "category": "General",
          "country": "Panamá",
          "countryFlag": "🇵🇦",
          "lang": "es",
          "url": "https://www.critica.com.pa/feed/",
          "domain": "critica.com.pa",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Política": [
        {
          "id": "pan_pol_128",
          "name": "Crítica - Política",
          "category": "Política",
          "country": "Panamá",
          "countryFlag": "🇵🇦",
          "lang": "es",
          "url": "https://www.critica.com.pa/category/politica/feed/",
          "domain": "critica.com.pa",
          "enabled": false,
          "isCustom": false
        }
      ]
    }
  },
  "Paraguay": {
    "country": "Paraguay",
    "flag": "🇵🇾",
    "lang": "es",
    "categories": {
      "General": [
        {
          "id": "par_gen_129",
          "name": "ABC Color",
          "category": "General",
          "country": "Paraguay",
          "countryFlag": "🇵🇾",
          "lang": "es",
          "url": "https://www.abc.com.py/arc/outboundfeeds/rss/",
          "domain": "abc.com.py",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "par_gen_130",
          "name": "Última Hora",
          "category": "General",
          "country": "Paraguay",
          "countryFlag": "🇵🇾",
          "lang": "es",
          "url": "https://www.ultimahora.com/rss/ultimas-noticias/",
          "domain": "ultimahora.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "par_gen_131",
          "name": "La Nación",
          "category": "General",
          "country": "Paraguay",
          "countryFlag": "🇵🇾",
          "lang": "es",
          "url": "https://www.lanacion.com.py/feed/",
          "domain": "lanacion.com.py",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Política": [
        {
          "id": "par_pol_132",
          "name": "La Nación - Política",
          "category": "Política",
          "country": "Paraguay",
          "countryFlag": "🇵🇾",
          "lang": "es",
          "url": "https://www.lanacion.com.py/category/politica/feed/",
          "domain": "lanacion.com.py",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Economía": [
        {
          "id": "par_eco_133",
          "name": "La Nación - Economía",
          "category": "Economía",
          "country": "Paraguay",
          "countryFlag": "🇵🇾",
          "lang": "es",
          "url": "https://www.lanacion.com.py/category/economia/feed/",
          "domain": "lanacion.com.py",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Deportes": [
        {
          "id": "par_dep_134",
          "name": "La Nación - Deportes",
          "category": "Deportes",
          "country": "Paraguay",
          "countryFlag": "🇵🇾",
          "lang": "es",
          "url": "https://www.lanacion.com.py/category/deportes/feed/",
          "domain": "lanacion.com.py",
          "enabled": false,
          "isCustom": false
        }
      ]
    }
  },
  "Perú": {
    "country": "Perú",
    "flag": "🇵🇪",
    "lang": "es",
    "categories": {
      "General": [
        {
          "id": "per_gen_135",
          "name": "El Comercio",
          "category": "General",
          "country": "Perú",
          "countryFlag": "🇵🇪",
          "lang": "es",
          "url": "https://elcomercio.pe/arc/outboundfeeds/rss/",
          "domain": "elcomercio.pe",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "per_gen_136",
          "name": "La República - Últimas noticias",
          "category": "General",
          "country": "Perú",
          "countryFlag": "🇵🇪",
          "lang": "es",
          "url": "https://larepublica.pe/rss/ultimas-noticias/",
          "domain": "larepublica.pe",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "per_gen_137",
          "name": "RPP - Últimas noticias",
          "category": "General",
          "country": "Perú",
          "countryFlag": "🇵🇪",
          "lang": "es",
          "url": "https://rpp.pe/rss/ultimas-noticias/",
          "domain": "rpp.pe",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "per_gen_138",
          "name": "OjoPúblico",
          "category": "General",
          "country": "Perú",
          "countryFlag": "🇵🇪",
          "lang": "es",
          "url": "https://ojo-publico.com/feed/",
          "domain": "ojo-publico.com",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Política": [
        {
          "id": "per_pol_139",
          "name": "La República - Política",
          "category": "Política",
          "country": "Perú",
          "countryFlag": "🇵🇪",
          "lang": "es",
          "url": "https://larepublica.pe/rss/politica/",
          "domain": "larepublica.pe",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "per_pol_140",
          "name": "RPP - Política",
          "category": "Política",
          "country": "Perú",
          "countryFlag": "🇵🇪",
          "lang": "es",
          "url": "https://rpp.pe/rss/politica/",
          "domain": "rpp.pe",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "per_pol_141",
          "name": "OjoPúblico - Política",
          "category": "Política",
          "country": "Perú",
          "countryFlag": "🇵🇪",
          "lang": "es",
          "url": "https://ojo-publico.com/category/politica/feed/",
          "domain": "ojo-publico.com",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Economía": [
        {
          "id": "per_eco_142",
          "name": "La República - Economía",
          "category": "Economía",
          "country": "Perú",
          "countryFlag": "🇵🇪",
          "lang": "es",
          "url": "https://larepublica.pe/rss/economia/",
          "domain": "larepublica.pe",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Deportes": [
        {
          "id": "per_dep_143",
          "name": "La República - Deportes",
          "category": "Deportes",
          "country": "Perú",
          "countryFlag": "🇵🇪",
          "lang": "es",
          "url": "https://larepublica.pe/rss/deportes/",
          "domain": "larepublica.pe",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "per_dep_144",
          "name": "RPP - Deportes",
          "category": "Deportes",
          "country": "Perú",
          "countryFlag": "🇵🇪",
          "lang": "es",
          "url": "https://rpp.pe/rss/deportes/",
          "domain": "rpp.pe",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Tecnología": [
        {
          "id": "per_tec_145",
          "name": "La República - Tecnología",
          "category": "Tecnología",
          "country": "Perú",
          "countryFlag": "🇵🇪",
          "lang": "es",
          "url": "https://larepublica.pe/rss/tecnologia/",
          "domain": "larepublica.pe",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Cultura": [
        {
          "id": "per_cul_146",
          "name": "La República - Cultura",
          "category": "Cultura",
          "country": "Perú",
          "countryFlag": "🇵🇪",
          "lang": "es",
          "url": "https://larepublica.pe/rss/cultura/",
          "domain": "larepublica.pe",
          "enabled": false,
          "isCustom": false
        }
      ]
    }
  },
  "República Dominicana": {
    "country": "República Dominicana",
    "flag": "🇩🇴",
    "lang": "es",
    "categories": {
      "General": [
        {
          "id": "rep_gen_147",
          "name": "Acento",
          "category": "General",
          "country": "República Dominicana",
          "countryFlag": "🇩🇴",
          "lang": "es",
          "url": "https://acento.com.do/feed/",
          "domain": "acento.com.do",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "rep_gen_148",
          "name": "Diario Libre - Últimas noticias",
          "category": "General",
          "country": "República Dominicana",
          "countryFlag": "🇩🇴",
          "lang": "es",
          "url": "https://www.diariolibre.com/rss/ultimas-noticias/",
          "domain": "diariolibre.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "rep_gen_149",
          "name": "Listín Diario",
          "category": "General",
          "country": "República Dominicana",
          "countryFlag": "🇩🇴",
          "lang": "es",
          "url": "https://www.listindiario.com/arc/outboundfeeds/rss/",
          "domain": "listindiario.com",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Política": [
        {
          "id": "rep_pol_150",
          "name": "Acento - Política",
          "category": "Política",
          "country": "República Dominicana",
          "countryFlag": "🇩🇴",
          "lang": "es",
          "url": "https://acento.com.do/category/politica/feed/",
          "domain": "acento.com.do",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "rep_pol_151",
          "name": "Diario Libre - Política",
          "category": "Política",
          "country": "República Dominicana",
          "countryFlag": "🇩🇴",
          "lang": "es",
          "url": "https://www.diariolibre.com/rss/politica/",
          "domain": "diariolibre.com",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Economía": [
        {
          "id": "rep_eco_152",
          "name": "Acento - Economía",
          "category": "Economía",
          "country": "República Dominicana",
          "countryFlag": "🇩🇴",
          "lang": "es",
          "url": "https://acento.com.do/category/economia/feed/",
          "domain": "acento.com.do",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Deportes": [
        {
          "id": "rep_dep_153",
          "name": "Diario Libre - Deportes",
          "category": "Deportes",
          "country": "República Dominicana",
          "countryFlag": "🇩🇴",
          "lang": "es",
          "url": "https://www.diariolibre.com/rss/deportes/",
          "domain": "diariolibre.com",
          "enabled": false,
          "isCustom": false
        }
      ]
    }
  },
  "Uruguay": {
    "country": "Uruguay",
    "flag": "🇺🇾",
    "lang": "es",
    "categories": {
      "General": [
        {
          "id": "uru_gen_154",
          "name": "la diaria",
          "category": "General",
          "country": "Uruguay",
          "countryFlag": "🇺🇾",
          "lang": "es",
          "url": "https://ladiaria.com.uy/rss/",
          "domain": "ladiaria.com.uy",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "uru_gen_155",
          "name": "El País - Portada",
          "category": "General",
          "country": "Uruguay",
          "countryFlag": "🇺🇾",
          "lang": "es",
          "url": "https://www.elpais.com.uy/rss/portada/",
          "domain": "elpais.com.uy",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "uru_gen_156",
          "name": "El Observador - Últimas noticias",
          "category": "General",
          "country": "Uruguay",
          "countryFlag": "🇺🇾",
          "lang": "es",
          "url": "https://www.elobservador.com.uy/rss/ultimas-noticias/",
          "domain": "elobservador.com.uy",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "uru_gen_157",
          "name": "Montevideo Portal - Últimas noticias",
          "category": "General",
          "country": "Uruguay",
          "countryFlag": "🇺🇾",
          "lang": "es",
          "url": "https://www.montevideo.com.uy/rss/ultimas-noticias/",
          "domain": "montevideo.com.uy",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Política": [
        {
          "id": "uru_pol_158",
          "name": "la diaria - Política",
          "category": "Política",
          "country": "Uruguay",
          "countryFlag": "🇺🇾",
          "lang": "es",
          "url": "https://ladiaria.com.uy/rss/politica/",
          "domain": "ladiaria.com.uy",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "uru_pol_159",
          "name": "El País - Política",
          "category": "Política",
          "country": "Uruguay",
          "countryFlag": "🇺🇾",
          "lang": "es",
          "url": "https://www.elpais.com.uy/rss/politica/",
          "domain": "elpais.com.uy",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Economía": [
        {
          "id": "uru_eco_160",
          "name": "la diaria - Economía",
          "category": "Economía",
          "country": "Uruguay",
          "countryFlag": "🇺🇾",
          "lang": "es",
          "url": "https://ladiaria.com.uy/rss/economia/",
          "domain": "ladiaria.com.uy",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "uru_eco_161",
          "name": "El País - Economía",
          "category": "Economía",
          "country": "Uruguay",
          "countryFlag": "🇺🇾",
          "lang": "es",
          "url": "https://www.elpais.com.uy/rss/economia/",
          "domain": "elpais.com.uy",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Deportes": [
        {
          "id": "uru_dep_162",
          "name": "El País - Deportes",
          "category": "Deportes",
          "country": "Uruguay",
          "countryFlag": "🇺🇾",
          "lang": "es",
          "url": "https://www.elpais.com.uy/rss/deportes/",
          "domain": "elpais.com.uy",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "uru_dep_163",
          "name": "Montevideo Portal - Deportes",
          "category": "Deportes",
          "country": "Uruguay",
          "countryFlag": "🇺🇾",
          "lang": "es",
          "url": "https://www.montevideo.com.uy/rss/deportes/",
          "domain": "montevideo.com.uy",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Cultura": [
        {
          "id": "uru_cul_164",
          "name": "El País - Cultura",
          "category": "Cultura",
          "country": "Uruguay",
          "countryFlag": "🇺🇾",
          "lang": "es",
          "url": "https://www.elpais.com.uy/rss/cultura/",
          "domain": "elpais.com.uy",
          "enabled": false,
          "isCustom": false
        }
      ]
    }
  },
  "Venezuela": {
    "country": "Venezuela",
    "flag": "🇻🇪",
    "lang": "es",
    "categories": {
      "General": [
        {
          "id": "ven_gen_165",
          "name": "El Nacional",
          "category": "General",
          "country": "Venezuela",
          "countryFlag": "🇻🇪",
          "lang": "es",
          "url": "https://www.elnacional.com/feed/",
          "domain": "elnacional.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "ven_gen_166",
          "name": "Efecto Cocuyo",
          "category": "General",
          "country": "Venezuela",
          "countryFlag": "🇻🇪",
          "lang": "es",
          "url": "https://efectococuyo.com/feed/",
          "domain": "efectococuyo.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "ven_gen_167",
          "name": "Tal Cual",
          "category": "General",
          "country": "Venezuela",
          "countryFlag": "🇻🇪",
          "lang": "es",
          "url": "https://talcualdigital.com/feed/",
          "domain": "talcualdigital.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "ven_gen_168",
          "name": "Runrun",
          "category": "General",
          "country": "Venezuela",
          "countryFlag": "🇻🇪",
          "lang": "es",
          "url": "https://runrun.es/feed/",
          "domain": "runrun.es",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "ven_gen_169",
          "name": "Prodavinci",
          "category": "General",
          "country": "Venezuela",
          "countryFlag": "🇻🇪",
          "lang": "es",
          "url": "https://prodavinci.com/feed/",
          "domain": "prodavinci.com",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Política": [
        {
          "id": "ven_pol_170",
          "name": "Efecto Cocuyo - Política",
          "category": "Política",
          "country": "Venezuela",
          "countryFlag": "🇻🇪",
          "lang": "es",
          "url": "https://efectococuyo.com/category/politica/feed/",
          "domain": "efectococuyo.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "ven_pol_171",
          "name": "Tal Cual - Política",
          "category": "Política",
          "country": "Venezuela",
          "countryFlag": "🇻🇪",
          "lang": "es",
          "url": "https://talcualdigital.com/category/politica/feed/",
          "domain": "talcualdigital.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "ven_pol_172",
          "name": "Runrun - Política",
          "category": "Política",
          "country": "Venezuela",
          "countryFlag": "🇻🇪",
          "lang": "es",
          "url": "https://runrun.es/category/politica/feed/",
          "domain": "runrun.es",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Economía": [
        {
          "id": "ven_eco_173",
          "name": "El Nacional - Economía",
          "category": "Economía",
          "country": "Venezuela",
          "countryFlag": "🇻🇪",
          "lang": "es",
          "url": "https://www.elnacional.com/category/economia/feed/",
          "domain": "elnacional.com",
          "enabled": false,
          "isCustom": false
        },
        {
          "id": "ven_eco_174",
          "name": "Efecto Cocuyo - Economía",
          "category": "Economía",
          "country": "Venezuela",
          "countryFlag": "🇻🇪",
          "lang": "es",
          "url": "https://efectococuyo.com/category/economia/feed/",
          "domain": "efectococuyo.com",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Deportes": [
        {
          "id": "ven_dep_175",
          "name": "Efecto Cocuyo - Deportes",
          "category": "Deportes",
          "country": "Venezuela",
          "countryFlag": "🇻🇪",
          "lang": "es",
          "url": "https://efectococuyo.com/category/deportes/feed/",
          "domain": "efectococuyo.com",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Tecnología": [
        {
          "id": "ven_tec_176",
          "name": "Efecto Cocuyo - Tecnología",
          "category": "Tecnología",
          "country": "Venezuela",
          "countryFlag": "🇻🇪",
          "lang": "es",
          "url": "https://efectococuyo.com/category/tecnologia/feed/",
          "domain": "efectococuyo.com",
          "enabled": false,
          "isCustom": false
        }
      ],
      "Cultura": [
        {
          "id": "ven_cul_177",
          "name": "Prodavinci - Cultura",
          "category": "Cultura",
          "country": "Venezuela",
          "countryFlag": "🇻🇪",
          "lang": "es",
          "url": "https://prodavinci.com/category/cultura/feed/",
          "domain": "prodavinci.com",
          "enabled": false,
          "isCustom": false
        }
      ]
    }
  }
};

var ALL_PRESET_FEEDS = [
  {
    "id": "reg_gen_1",
    "name": "BBC Mundo",
    "category": "General",
    "country": "Regional / Internacional",
    "countryFlag": "🌍",
    "lang": "es",
    "url": "https://feeds.bbci.co.uk/mundo/rss.xml",
    "domain": "feeds.bbci.co.uk",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "reg_gen_2",
    "name": "DW Español",
    "category": "General",
    "country": "Regional / Internacional",
    "countryFlag": "🌍",
    "lang": "es",
    "url": "https://rss.dw.com/xml/rss-sp-all",
    "domain": "rss.dw.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "reg_gen_3",
    "name": "CNN en Español",
    "category": "General",
    "country": "Regional / Internacional",
    "countryFlag": "🌍",
    "lang": "es",
    "url": "https://cnnespanol.cnn.com/feed/",
    "domain": "cnnespanol.cnn.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "reg_eco_4",
    "name": "AméricaEconomía",
    "category": "Economía",
    "country": "Regional / Internacional",
    "countryFlag": "🌍",
    "lang": "es",
    "url": "https://www.americaeconomia.com/feed",
    "domain": "americaeconomia.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "arg_gen_5",
    "name": "La Nación - Últimas noticias",
    "category": "General",
    "country": "Argentina",
    "countryFlag": "🇦🇷",
    "lang": "es",
    "url": "https://www.lanacion.com.ar/arc/outboundfeeds/rss/",
    "domain": "lanacion.com.ar",
    "enabled": true,
    "isCustom": false
  },
  {
    "id": "arg_gen_6",
    "name": "Clarín - Último momento",
    "category": "General",
    "country": "Argentina",
    "countryFlag": "🇦🇷",
    "lang": "es",
    "url": "https://www.clarin.com/rss/lo-ultimo/",
    "domain": "clarin.com",
    "enabled": true,
    "isCustom": false
  },
  {
    "id": "arg_gen_7",
    "name": "Infobae",
    "category": "General",
    "country": "Argentina",
    "countryFlag": "🇦🇷",
    "lang": "es",
    "url": "https://www.infobae.com/arc/outboundfeeds/rss/",
    "domain": "infobae.com",
    "enabled": true,
    "isCustom": false
  },
  {
    "id": "arg_gen_8",
    "name": "Perfil - Últimas noticias",
    "category": "General",
    "country": "Argentina",
    "countryFlag": "🇦🇷",
    "lang": "es",
    "url": "https://www.perfil.com/feed",
    "domain": "pagina12.com.ar",
    "enabled": true,
    "isCustom": false
  },
  {
    "id": "arg_pol_9",
    "name": "La Nación - Política",
    "category": "Política",
    "country": "Argentina",
    "countryFlag": "🇦🇷",
    "lang": "es",
    "url": "https://www.lanacion.com.ar/rss/politica/",
    "domain": "lanacion.com.ar",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "arg_pol_10",
    "name": "Clarín - Política",
    "category": "Política",
    "country": "Argentina",
    "countryFlag": "🇦🇷",
    "lang": "es",
    "url": "https://www.clarin.com/rss/politica/",
    "domain": "clarin.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "arg_pol_11",
    "name": "Página/12 - El País",
    "category": "Política",
    "country": "Argentina",
    "countryFlag": "🇦🇷",
    "lang": "es",
    "url": "https://www.pagina12.com.ar/rss/el-pais.xml",
    "domain": "pagina12.com.ar",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "arg_eco_12",
    "name": "La Nación - Economía",
    "category": "Economía",
    "country": "Argentina",
    "countryFlag": "🇦🇷",
    "lang": "es",
    "url": "https://www.lanacion.com.ar/rss/economia/",
    "domain": "lanacion.com.ar",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "arg_eco_13",
    "name": "Clarín - Economía",
    "category": "Economía",
    "country": "Argentina",
    "countryFlag": "🇦🇷",
    "lang": "es",
    "url": "https://www.clarin.com/rss/economia/",
    "domain": "clarin.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "arg_eco_14",
    "name": "Ámbito - Economía",
    "category": "Economía",
    "country": "Argentina",
    "countryFlag": "🇦🇷",
    "lang": "es",
    "url": "https://www.ambito.com/rss/economia/",
    "domain": "ambito.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "arg_dep_15",
    "name": "La Nación - Deportes",
    "category": "Deportes",
    "country": "Argentina",
    "countryFlag": "🇦🇷",
    "lang": "es",
    "url": "https://www.lanacion.com.ar/rss/deportes/",
    "domain": "lanacion.com.ar",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "arg_dep_16",
    "name": "Clarín - Deportes",
    "category": "Deportes",
    "country": "Argentina",
    "countryFlag": "🇦🇷",
    "lang": "es",
    "url": "https://www.clarin.com/rss/deportes/",
    "domain": "clarin.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "arg_tec_17",
    "name": "La Nación - Tecnología",
    "category": "Tecnología",
    "country": "Argentina",
    "countryFlag": "🇦🇷",
    "lang": "es",
    "url": "https://www.lanacion.com.ar/rss/tecnologia/",
    "domain": "lanacion.com.ar",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "arg_tec_18",
    "name": "Clarín - Tecnología",
    "category": "Tecnología",
    "country": "Argentina",
    "countryFlag": "🇦🇷",
    "lang": "es",
    "url": "https://www.clarin.com/rss/tecnologia/",
    "domain": "clarin.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "arg_cul_19",
    "name": "La Nación - Cultura",
    "category": "Cultura",
    "country": "Argentina",
    "countryFlag": "🇦🇷",
    "lang": "es",
    "url": "https://www.lanacion.com.ar/rss/cultura/",
    "domain": "lanacion.com.ar",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "arg_cul_20",
    "name": "Clarín - Cultura",
    "category": "Cultura",
    "country": "Argentina",
    "countryFlag": "🇦🇷",
    "lang": "es",
    "url": "https://www.clarin.com/rss/cultura/",
    "domain": "clarin.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "bol_gen_21",
    "name": "El Deber",
    "category": "General",
    "country": "Bolivia",
    "countryFlag": "🇧🇴",
    "lang": "es",
    "url": "https://eldeber.com.bo/feed/",
    "domain": "eldeber.com.bo",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "bol_gen_22",
    "name": "Los Tiempos",
    "category": "General",
    "country": "Bolivia",
    "countryFlag": "🇧🇴",
    "lang": "es",
    "url": "https://www.lostiempos.com/feed/",
    "domain": "lostiempos.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "bol_gen_23",
    "name": "Página Siete",
    "category": "General",
    "country": "Bolivia",
    "countryFlag": "🇧🇴",
    "lang": "es",
    "url": "https://www.paginasiete.bo/feed/",
    "domain": "paginasiete.bo",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "bol_gen_24",
    "name": "Brújula Digital",
    "category": "General",
    "country": "Bolivia",
    "countryFlag": "🇧🇴",
    "lang": "es",
    "url": "https://brujuladigital.net/feed/",
    "domain": "brujuladigital.net",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "bol_pol_25",
    "name": "Página Siete - Política",
    "category": "Política",
    "country": "Bolivia",
    "countryFlag": "🇧🇴",
    "lang": "es",
    "url": "https://www.paginasiete.bo/category/politica/feed/",
    "domain": "paginasiete.bo",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "bol_pol_26",
    "name": "Brújula Digital - Política",
    "category": "Política",
    "country": "Bolivia",
    "countryFlag": "🇧🇴",
    "lang": "es",
    "url": "https://brujuladigital.net/category/politica/feed/",
    "domain": "brujuladigital.net",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "bol_eco_27",
    "name": "Página Siete - Economía",
    "category": "Economía",
    "country": "Bolivia",
    "countryFlag": "🇧🇴",
    "lang": "es",
    "url": "https://www.paginasiete.bo/category/economia/feed/",
    "domain": "paginasiete.bo",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "bol_dep_28",
    "name": "Página Siete - Deportes",
    "category": "Deportes",
    "country": "Bolivia",
    "countryFlag": "🇧🇴",
    "lang": "es",
    "url": "https://www.paginasiete.bo/category/deportes/feed/",
    "domain": "paginasiete.bo",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "bra_gen_29",
    "name": "Folha de S.Paulo",
    "category": "General",
    "country": "Brasil",
    "countryFlag": "🇧🇷",
    "lang": "pt",
    "url": "https://feeds.folha.uol.com.br/folha/rss.xml",
    "domain": "feeds.folha.uol.com.br",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "bra_gen_30",
    "name": "G1",
    "category": "General",
    "country": "Brasil",
    "countryFlag": "🇧🇷",
    "lang": "pt",
    "url": "https://g1.globo.com/rss/g1.xml",
    "domain": "g1.globo.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "bra_gen_31",
    "name": "CNN Brasil",
    "category": "General",
    "country": "Brasil",
    "countryFlag": "🇧🇷",
    "lang": "pt",
    "url": "https://www.cnnbrasil.com.br/feed/",
    "domain": "cnnbrasil.com.br",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "bra_pol_32",
    "name": "Folha - Poder",
    "category": "Política",
    "country": "Brasil",
    "countryFlag": "🇧🇷",
    "lang": "pt",
    "url": "https://feeds.folha.uol.com.br/poder/rss.xml",
    "domain": "feeds.folha.uol.com.br",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "bra_pol_33",
    "name": "G1 - Política",
    "category": "Política",
    "country": "Brasil",
    "countryFlag": "🇧🇷",
    "lang": "pt",
    "url": "https://g1.globo.com/rss/g1/politica/",
    "domain": "g1.globo.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "bra_pol_34",
    "name": "CNN Brasil - Política",
    "category": "Política",
    "country": "Brasil",
    "countryFlag": "🇧🇷",
    "lang": "pt",
    "url": "https://www.cnnbrasil.com.br/category/politica/feed/",
    "domain": "cnnbrasil.com.br",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "bra_eco_35",
    "name": "Folha - Mercado",
    "category": "Economía",
    "country": "Brasil",
    "countryFlag": "🇧🇷",
    "lang": "pt",
    "url": "https://feeds.folha.uol.com.br/mercado/rss.xml",
    "domain": "feeds.folha.uol.com.br",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "bra_eco_36",
    "name": "G1 - Economía",
    "category": "Economía",
    "country": "Brasil",
    "countryFlag": "🇧🇷",
    "lang": "pt",
    "url": "https://g1.globo.com/rss/g1/economia/",
    "domain": "g1.globo.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "bra_eco_37",
    "name": "CNN Brasil - Economía",
    "category": "Economía",
    "country": "Brasil",
    "countryFlag": "🇧🇷",
    "lang": "pt",
    "url": "https://www.cnnbrasil.com.br/category/economia/feed/",
    "domain": "cnnbrasil.com.br",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "bra_dep_38",
    "name": "Folha - Esporte",
    "category": "Deportes",
    "country": "Brasil",
    "countryFlag": "🇧🇷",
    "lang": "pt",
    "url": "https://feeds.folha.uol.com.br/esporte/rss.xml",
    "domain": "feeds.folha.uol.com.br",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "bra_tec_39",
    "name": "Folha - Tec",
    "category": "Tecnología",
    "country": "Brasil",
    "countryFlag": "🇧🇷",
    "lang": "pt",
    "url": "https://feeds.folha.uol.com.br/tec/rss.xml",
    "domain": "feeds.folha.uol.com.br",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "bra_tec_40",
    "name": "G1 - Tecnología",
    "category": "Tecnología",
    "country": "Brasil",
    "countryFlag": "🇧🇷",
    "lang": "pt",
    "url": "https://g1.globo.com/rss/g1/tecnologia/",
    "domain": "g1.globo.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "bra_cul_41",
    "name": "Folha - Ilustrada",
    "category": "Cultura",
    "country": "Brasil",
    "countryFlag": "🇧🇷",
    "lang": "pt",
    "url": "https://feeds.folha.uol.com.br/ilustrada/rss.xml",
    "domain": "feeds.folha.uol.com.br",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "chi_gen_42",
    "name": "La Tercera",
    "category": "General",
    "country": "Chile",
    "countryFlag": "🇨🇱",
    "lang": "es",
    "url": "https://www.latercera.com/arc/outboundfeeds/rss/",
    "domain": "latercera.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "chi_gen_43",
    "name": "Emol",
    "category": "General",
    "country": "Chile",
    "countryFlag": "🇨🇱",
    "lang": "es",
    "url": "https://www.emol.com/rss/",
    "domain": "emol.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "chi_gen_44",
    "name": "Cooperativa - Últimas noticias",
    "category": "General",
    "country": "Chile",
    "countryFlag": "🇨🇱",
    "lang": "es",
    "url": "https://www.cooperativa.cl/rss/ultimas-noticias/",
    "domain": "cooperativa.cl",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "chi_gen_45",
    "name": "BioBioChile - Últimas noticias",
    "category": "General",
    "country": "Chile",
    "countryFlag": "🇨🇱",
    "lang": "es",
    "url": "https://www.biobiochile.cl/rss/ultimas-noticias.xml",
    "domain": "biobiochile.cl",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "chi_gen_46",
    "name": "El Mostrador",
    "category": "General",
    "country": "Chile",
    "countryFlag": "🇨🇱",
    "lang": "es",
    "url": "https://www.elmostrador.cl/feed/",
    "domain": "elmostrador.cl",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "chi_pol_47",
    "name": "Emol - Nacional",
    "category": "Política",
    "country": "Chile",
    "countryFlag": "🇨🇱",
    "lang": "es",
    "url": "https://www.emol.com/rss/nacional/",
    "domain": "emol.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "chi_pol_48",
    "name": "El Mostrador - Política",
    "category": "Política",
    "country": "Chile",
    "countryFlag": "🇨🇱",
    "lang": "es",
    "url": "https://www.elmostrador.cl/category/politica/feed/",
    "domain": "elmostrador.cl",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "chi_eco_49",
    "name": "Emol - Economía",
    "category": "Economía",
    "country": "Chile",
    "countryFlag": "🇨🇱",
    "lang": "es",
    "url": "https://www.emol.com/rss/economia/",
    "domain": "emol.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "chi_eco_50",
    "name": "Cooperativa - Economía",
    "category": "Economía",
    "country": "Chile",
    "countryFlag": "🇨🇱",
    "lang": "es",
    "url": "https://www.cooperativa.cl/rss/economia/",
    "domain": "cooperativa.cl",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "chi_dep_51",
    "name": "Emol - Deportes",
    "category": "Deportes",
    "country": "Chile",
    "countryFlag": "🇨🇱",
    "lang": "es",
    "url": "https://www.emol.com/rss/deportes/",
    "domain": "emol.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "chi_dep_52",
    "name": "Cooperativa - Deportes",
    "category": "Deportes",
    "country": "Chile",
    "countryFlag": "🇨🇱",
    "lang": "es",
    "url": "https://www.cooperativa.cl/rss/deportes/",
    "domain": "cooperativa.cl",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "chi_tec_53",
    "name": "Emol - Tecnología",
    "category": "Tecnología",
    "country": "Chile",
    "countryFlag": "🇨🇱",
    "lang": "es",
    "url": "https://www.emol.com/rss/tecnologia/",
    "domain": "emol.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "chi_cul_54",
    "name": "Emol - Cultura",
    "category": "Cultura",
    "country": "Chile",
    "countryFlag": "🇨🇱",
    "lang": "es",
    "url": "https://www.emol.com/rss/cultura/",
    "domain": "emol.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "chi_cul_55",
    "name": "El Mostrador - Cultura",
    "category": "Cultura",
    "country": "Chile",
    "countryFlag": "🇨🇱",
    "lang": "es",
    "url": "https://www.elmostrador.cl/category/cultura/feed/",
    "domain": "elmostrador.cl",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "col_gen_56",
    "name": "El Tiempo",
    "category": "General",
    "country": "Colombia",
    "countryFlag": "🇨🇴",
    "lang": "es",
    "url": "https://www.eltiempo.com/arc/outboundfeeds/rss/",
    "domain": "eltiempo.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "col_gen_57",
    "name": "El Espectador",
    "category": "General",
    "country": "Colombia",
    "countryFlag": "🇨🇴",
    "lang": "es",
    "url": "https://www.elespectador.com/arc/outboundfeeds/rss/",
    "domain": "elespectador.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "col_gen_58",
    "name": "Semana",
    "category": "General",
    "country": "Colombia",
    "countryFlag": "🇨🇴",
    "lang": "es",
    "url": "https://www.semana.com/feed/",
    "domain": "semana.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "col_gen_59",
    "name": "La Silla Vacía",
    "category": "General",
    "country": "Colombia",
    "countryFlag": "🇨🇴",
    "lang": "es",
    "url": "https://www.lasillavacia.com/feed/",
    "domain": "lasillavacia.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "col_pol_60",
    "name": "Semana - Política",
    "category": "Política",
    "country": "Colombia",
    "countryFlag": "🇨🇴",
    "lang": "es",
    "url": "https://www.semana.com/category/politica/feed/",
    "domain": "semana.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "col_pol_61",
    "name": "La Silla Vacía - Política",
    "category": "Política",
    "country": "Colombia",
    "countryFlag": "🇨🇴",
    "lang": "es",
    "url": "https://www.lasillavacia.com/category/politica/feed/",
    "domain": "lasillavacia.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "col_eco_62",
    "name": "Valora Analitik - Economía",
    "category": "Economía",
    "country": "Colombia",
    "countryFlag": "🇨🇴",
    "lang": "es",
    "url": "https://www.valoraanalitik.com/category/economia/feed/",
    "domain": "valoraanalitik.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "col_dep_63",
    "name": "Semana - Deportes",
    "category": "Deportes",
    "country": "Colombia",
    "countryFlag": "🇨🇴",
    "lang": "es",
    "url": "https://www.semana.com/category/deportes/feed/",
    "domain": "semana.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "col_tec_64",
    "name": "Semana - Tecnología",
    "category": "Tecnología",
    "country": "Colombia",
    "countryFlag": "🇨🇴",
    "lang": "es",
    "url": "https://www.semana.com/category/tecnologia/feed/",
    "domain": "semana.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "col_cul_65",
    "name": "Semana - Cultura",
    "category": "Cultura",
    "country": "Colombia",
    "countryFlag": "🇨🇴",
    "lang": "es",
    "url": "https://www.semana.com/category/cultura/feed/",
    "domain": "semana.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "cos_gen_66",
    "name": "La Nación",
    "category": "General",
    "country": "Costa Rica",
    "countryFlag": "🇨🇷",
    "lang": "es",
    "url": "https://www.nacion.com/arc/outboundfeeds/rss/",
    "domain": "nacion.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "cos_gen_67",
    "name": "Amelia Rueda",
    "category": "General",
    "country": "Costa Rica",
    "countryFlag": "🇨🇷",
    "lang": "es",
    "url": "https://www.ameliarueda.com/feed/",
    "domain": "ameliarueda.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "cos_gen_68",
    "name": "CRHoy",
    "category": "General",
    "country": "Costa Rica",
    "countryFlag": "🇨🇷",
    "lang": "es",
    "url": "https://www.crhoy.com/feed/",
    "domain": "crhoy.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "cos_gen_69",
    "name": "El Financiero",
    "category": "General",
    "country": "Costa Rica",
    "countryFlag": "🇨🇷",
    "lang": "es",
    "url": "https://www.elfinancierocr.com/feed/",
    "domain": "elfinancierocr.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "cos_pol_70",
    "name": "Amelia Rueda - Política",
    "category": "Política",
    "country": "Costa Rica",
    "countryFlag": "🇨🇷",
    "lang": "es",
    "url": "https://www.ameliarueda.com/category/politica/feed/",
    "domain": "ameliarueda.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "cos_pol_71",
    "name": "CRHoy - Política",
    "category": "Política",
    "country": "Costa Rica",
    "countryFlag": "🇨🇷",
    "lang": "es",
    "url": "https://www.crhoy.com/category/politica/feed/",
    "domain": "crhoy.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "cos_eco_72",
    "name": "El Financiero - Economía",
    "category": "Economía",
    "country": "Costa Rica",
    "countryFlag": "🇨🇷",
    "lang": "es",
    "url": "https://www.elfinancierocr.com/category/economia/feed/",
    "domain": "elfinancierocr.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "cos_dep_73",
    "name": "CRHoy - Deportes",
    "category": "Deportes",
    "country": "Costa Rica",
    "countryFlag": "🇨🇷",
    "lang": "es",
    "url": "https://www.crhoy.com/category/deportes/feed/",
    "domain": "crhoy.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "cos_tec_74",
    "name": "CRHoy - Tecnología",
    "category": "Tecnología",
    "country": "Costa Rica",
    "countryFlag": "🇨🇷",
    "lang": "es",
    "url": "https://www.crhoy.com/category/tecnologia/feed/",
    "domain": "crhoy.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "cub_gen_75",
    "name": "Cubadebate",
    "category": "General",
    "country": "Cuba",
    "countryFlag": "🇨🇺",
    "lang": "es",
    "url": "https://www.cubadebate.cu/feed/",
    "domain": "cubadebate.cu",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "cub_gen_76",
    "name": "14ymedio",
    "category": "General",
    "country": "Cuba",
    "countryFlag": "🇨🇺",
    "lang": "es",
    "url": "https://www.14ymedio.com/feed/",
    "domain": "14ymedio.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "cub_gen_77",
    "name": "El Toque",
    "category": "General",
    "country": "Cuba",
    "countryFlag": "🇨🇺",
    "lang": "es",
    "url": "https://eltoque.com/feed/",
    "domain": "eltoque.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "cub_pol_78",
    "name": "Cubadebate - Política",
    "category": "Política",
    "country": "Cuba",
    "countryFlag": "🇨🇺",
    "lang": "es",
    "url": "https://www.cubadebate.cu/category/politica/feed/",
    "domain": "cubadebate.cu",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "cub_pol_79",
    "name": "14ymedio - Política",
    "category": "Política",
    "country": "Cuba",
    "countryFlag": "🇨🇺",
    "lang": "es",
    "url": "https://www.14ymedio.com/category/politica/feed/",
    "domain": "14ymedio.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "cub_eco_80",
    "name": "Cubadebate - Economía",
    "category": "Economía",
    "country": "Cuba",
    "countryFlag": "🇨🇺",
    "lang": "es",
    "url": "https://www.cubadebate.cu/category/economia/feed/",
    "domain": "cubadebate.cu",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "cub_eco_81",
    "name": "El Toque - Economía",
    "category": "Economía",
    "country": "Cuba",
    "countryFlag": "🇨🇺",
    "lang": "es",
    "url": "https://eltoque.com/category/economia/feed/",
    "domain": "eltoque.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "cub_cul_82",
    "name": "Cubadebate - Cultura",
    "category": "Cultura",
    "country": "Cuba",
    "countryFlag": "🇨🇺",
    "lang": "es",
    "url": "https://www.cubadebate.cu/category/cultura/feed/",
    "domain": "cubadebate.cu",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "ecu_gen_83",
    "name": "El Universo",
    "category": "General",
    "country": "Ecuador",
    "countryFlag": "🇪🇨",
    "lang": "es",
    "url": "https://www.eluniverso.com/arc/outboundfeeds/rss/",
    "domain": "eluniverso.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "ecu_gen_84",
    "name": "El Comercio",
    "category": "General",
    "country": "Ecuador",
    "countryFlag": "🇪🇨",
    "lang": "es",
    "url": "https://www.elcomercio.com/feed/",
    "domain": "elcomercio.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "ecu_gen_85",
    "name": "Primicias",
    "category": "General",
    "country": "Ecuador",
    "countryFlag": "🇪🇨",
    "lang": "es",
    "url": "https://www.primicias.ec/feed/",
    "domain": "primicias.ec",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "ecu_gen_86",
    "name": "GK",
    "category": "General",
    "country": "Ecuador",
    "countryFlag": "🇪🇨",
    "lang": "es",
    "url": "https://gk.city/feed/",
    "domain": "gk.city",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "ecu_pol_87",
    "name": "Primicias - Política",
    "category": "Política",
    "country": "Ecuador",
    "countryFlag": "🇪🇨",
    "lang": "es",
    "url": "https://www.primicias.ec/category/politica/feed/",
    "domain": "primicias.ec",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "ecu_pol_88",
    "name": "El Comercio - Política",
    "category": "Política",
    "country": "Ecuador",
    "countryFlag": "🇪🇨",
    "lang": "es",
    "url": "https://www.elcomercio.com/category/politica/feed/",
    "domain": "elcomercio.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "ecu_eco_89",
    "name": "Primicias - Economía",
    "category": "Economía",
    "country": "Ecuador",
    "countryFlag": "🇪🇨",
    "lang": "es",
    "url": "https://www.primicias.ec/category/economia/feed/",
    "domain": "primicias.ec",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "ecu_dep_90",
    "name": "Primicias - Deportes",
    "category": "Deportes",
    "country": "Ecuador",
    "countryFlag": "🇪🇨",
    "lang": "es",
    "url": "https://www.primicias.ec/category/deportes/feed/",
    "domain": "primicias.ec",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "ecu_tec_91",
    "name": "GK - Tecnología",
    "category": "Tecnología",
    "country": "Ecuador",
    "countryFlag": "🇪🇨",
    "lang": "es",
    "url": "https://gk.city/category/tecnologia/feed/",
    "domain": "gk.city",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "el _gen_92",
    "name": "El Faro",
    "category": "General",
    "country": "El Salvador",
    "countryFlag": "🇸🇻",
    "lang": "es",
    "url": "https://elfaro.net/feed/",
    "domain": "elfaro.net",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "el _gen_93",
    "name": "GatoEncerrado",
    "category": "General",
    "country": "El Salvador",
    "countryFlag": "🇸🇻",
    "lang": "es",
    "url": "https://revistagatoencerrado.net/feed/",
    "domain": "revistagatoencerrado.net",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "el _gen_94",
    "name": "La Prensa Gráfica",
    "category": "General",
    "country": "El Salvador",
    "countryFlag": "🇸🇻",
    "lang": "es",
    "url": "https://www.laprensagrafica.com/rss/ultimas-noticias/",
    "domain": "laprensagrafica.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "el _pol_95",
    "name": "El Faro - Política",
    "category": "Política",
    "country": "El Salvador",
    "countryFlag": "🇸🇻",
    "lang": "es",
    "url": "https://elfaro.net/category/politica/feed/",
    "domain": "elfaro.net",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "el _pol_96",
    "name": "GatoEncerrado - Política",
    "category": "Política",
    "country": "El Salvador",
    "countryFlag": "🇸🇻",
    "lang": "es",
    "url": "https://revistagatoencerrado.net/category/politica/feed/",
    "domain": "revistagatoencerrado.net",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "el _cul_97",
    "name": "GatoEncerrado - Cultura",
    "category": "Cultura",
    "country": "El Salvador",
    "countryFlag": "🇸🇻",
    "lang": "es",
    "url": "https://revistagatoencerrado.net/category/cultura/feed/",
    "domain": "revistagatoencerrado.net",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "gua_gen_98",
    "name": "Prensa Libre",
    "category": "General",
    "country": "Guatemala",
    "countryFlag": "🇬🇹",
    "lang": "es",
    "url": "https://www.prensalibre.com/arc/outboundfeeds/rss/",
    "domain": "prensalibre.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "gua_gen_99",
    "name": "elPeriódico",
    "category": "General",
    "country": "Guatemala",
    "countryFlag": "🇬🇹",
    "lang": "es",
    "url": "https://elperiodico.com.gt/feed/",
    "domain": "elperiodico.com.gt",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "gua_gen_100",
    "name": "Plaza Pública",
    "category": "General",
    "country": "Guatemala",
    "countryFlag": "🇬🇹",
    "lang": "es",
    "url": "https://www.plazapublica.com.gt/feed/",
    "domain": "plazapublica.com.gt",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "gua_gen_101",
    "name": "Soy502",
    "category": "General",
    "country": "Guatemala",
    "countryFlag": "🇬🇹",
    "lang": "es",
    "url": "https://www.soy502.com/feed/",
    "domain": "soy502.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "gua_pol_102",
    "name": "elPeriódico - Política",
    "category": "Política",
    "country": "Guatemala",
    "countryFlag": "🇬🇹",
    "lang": "es",
    "url": "https://elperiodico.com.gt/category/politica/feed/",
    "domain": "elperiodico.com.gt",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "gua_pol_103",
    "name": "Plaza Pública - Política",
    "category": "Política",
    "country": "Guatemala",
    "countryFlag": "🇬🇹",
    "lang": "es",
    "url": "https://www.plazapublica.com.gt/category/politica/feed/",
    "domain": "plazapublica.com.gt",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "hon_gen_104",
    "name": "Confidencial Honduras",
    "category": "General",
    "country": "Honduras",
    "countryFlag": "🇭🇳",
    "lang": "es",
    "url": "https://confidencial.hn/feed/",
    "domain": "confidencial.hn",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "hon_gen_105",
    "name": "La Prensa",
    "category": "General",
    "country": "Honduras",
    "countryFlag": "🇭🇳",
    "lang": "es",
    "url": "https://www.laprensa.hn/rss/ultimas-noticias/",
    "domain": "laprensa.hn",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "hon_pol_106",
    "name": "Confidencial Honduras - Política",
    "category": "Política",
    "country": "Honduras",
    "countryFlag": "🇭🇳",
    "lang": "es",
    "url": "https://confidencial.hn/category/politica/feed/",
    "domain": "confidencial.hn",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "méx_gen_107",
    "name": "Animal Político",
    "category": "General",
    "country": "México",
    "countryFlag": "🇲🇽",
    "lang": "es",
    "url": "https://www.animalpolitico.com/feed/",
    "domain": "animalpolitico.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "méx_gen_108",
    "name": "Aristegui Noticias",
    "category": "General",
    "country": "México",
    "countryFlag": "🇲🇽",
    "lang": "es",
    "url": "https://aristeguinoticias.com/feed/",
    "domain": "aristeguinoticias.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "méx_gen_109",
    "name": "SinEmbargo",
    "category": "General",
    "country": "México",
    "countryFlag": "🇲🇽",
    "lang": "es",
    "url": "https://www.sinembargo.mx/feed/",
    "domain": "sinembargo.mx",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "méx_gen_110",
    "name": "Proceso",
    "category": "General",
    "country": "México",
    "countryFlag": "🇲🇽",
    "lang": "es",
    "url": "https://www.proceso.com.mx/feed/",
    "domain": "proceso.com.mx",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "méx_gen_111",
    "name": "La Jornada - Portada",
    "category": "General",
    "country": "México",
    "countryFlag": "🇲🇽",
    "lang": "es",
    "url": "https://www.jornada.com.mx/rss/portada.xml",
    "domain": "jornada.com.mx",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "méx_pol_112",
    "name": "Animal Político - Política",
    "category": "Política",
    "country": "México",
    "countryFlag": "🇲🇽",
    "lang": "es",
    "url": "https://www.animalpolitico.com/category/politica/feed/",
    "domain": "animalpolitico.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "méx_pol_113",
    "name": "Aristegui Noticias - Política",
    "category": "Política",
    "country": "México",
    "countryFlag": "🇲🇽",
    "lang": "es",
    "url": "https://aristeguinoticias.com/category/politica/feed/",
    "domain": "aristeguinoticias.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "méx_pol_114",
    "name": "Proceso - Política",
    "category": "Política",
    "country": "México",
    "countryFlag": "🇲🇽",
    "lang": "es",
    "url": "https://www.proceso.com.mx/category/politica/feed/",
    "domain": "proceso.com.mx",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "méx_pol_115",
    "name": "La Jornada - Política",
    "category": "Política",
    "country": "México",
    "countryFlag": "🇲🇽",
    "lang": "es",
    "url": "https://www.jornada.com.mx/rss/politica.xml",
    "domain": "jornada.com.mx",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "méx_eco_116",
    "name": "El Economista",
    "category": "Economía",
    "country": "México",
    "countryFlag": "🇲🇽",
    "lang": "es",
    "url": "https://www.eleconomista.com.mx/rss/ultimas-noticias/",
    "domain": "eleconomista.com.mx",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "méx_eco_117",
    "name": "La Jornada - Economía",
    "category": "Economía",
    "country": "México",
    "countryFlag": "🇲🇽",
    "lang": "es",
    "url": "https://www.jornada.com.mx/rss/economia.xml",
    "domain": "jornada.com.mx",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "méx_dep_118",
    "name": "La Jornada - Deportes",
    "category": "Deportes",
    "country": "México",
    "countryFlag": "🇲🇽",
    "lang": "es",
    "url": "https://www.jornada.com.mx/rss/deportes.xml",
    "domain": "jornada.com.mx",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "méx_dep_119",
    "name": "Animal Político - Deportes",
    "category": "Deportes",
    "country": "México",
    "countryFlag": "🇲🇽",
    "lang": "es",
    "url": "https://www.animalpolitico.com/category/deportes/feed/",
    "domain": "animalpolitico.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "méx_tec_120",
    "name": "Proceso - Tecnología",
    "category": "Tecnología",
    "country": "México",
    "countryFlag": "🇲🇽",
    "lang": "es",
    "url": "https://www.proceso.com.mx/category/tecnologia/feed/",
    "domain": "proceso.com.mx",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "méx_cul_121",
    "name": "La Jornada - Cultura",
    "category": "Cultura",
    "country": "México",
    "countryFlag": "🇲🇽",
    "lang": "es",
    "url": "https://www.jornada.com.mx/rss/cultura.xml",
    "domain": "jornada.com.mx",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "méx_cul_122",
    "name": "Proceso - Cultura",
    "category": "Cultura",
    "country": "México",
    "countryFlag": "🇲🇽",
    "lang": "es",
    "url": "https://www.proceso.com.mx/category/cultura/feed/",
    "domain": "proceso.com.mx",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "nic_gen_123",
    "name": "Confidencial",
    "category": "General",
    "country": "Nicaragua",
    "countryFlag": "🇳🇮",
    "lang": "es",
    "url": "https://confidencial.digital/feed/",
    "domain": "confidencial.digital",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "nic_gen_124",
    "name": "La Prensa",
    "category": "General",
    "country": "Nicaragua",
    "countryFlag": "🇳🇮",
    "lang": "es",
    "url": "https://www.laprensa.com.ni/rss/ultimas-noticias/",
    "domain": "laprensa.com.ni",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "nic_pol_125",
    "name": "Confidencial - Política",
    "category": "Política",
    "country": "Nicaragua",
    "countryFlag": "🇳🇮",
    "lang": "es",
    "url": "https://confidencial.digital/category/politica/feed/",
    "domain": "confidencial.digital",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "pan_gen_126",
    "name": "La Prensa",
    "category": "General",
    "country": "Panamá",
    "countryFlag": "🇵🇦",
    "lang": "es",
    "url": "https://www.prensa.com/arc/outboundfeeds/rss/",
    "domain": "prensa.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "pan_gen_127",
    "name": "Crítica",
    "category": "General",
    "country": "Panamá",
    "countryFlag": "🇵🇦",
    "lang": "es",
    "url": "https://www.critica.com.pa/feed/",
    "domain": "critica.com.pa",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "pan_pol_128",
    "name": "Crítica - Política",
    "category": "Política",
    "country": "Panamá",
    "countryFlag": "🇵🇦",
    "lang": "es",
    "url": "https://www.critica.com.pa/category/politica/feed/",
    "domain": "critica.com.pa",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "par_gen_129",
    "name": "ABC Color",
    "category": "General",
    "country": "Paraguay",
    "countryFlag": "🇵🇾",
    "lang": "es",
    "url": "https://www.abc.com.py/arc/outboundfeeds/rss/",
    "domain": "abc.com.py",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "par_gen_130",
    "name": "Última Hora",
    "category": "General",
    "country": "Paraguay",
    "countryFlag": "🇵🇾",
    "lang": "es",
    "url": "https://www.ultimahora.com/rss/ultimas-noticias/",
    "domain": "ultimahora.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "par_gen_131",
    "name": "La Nación",
    "category": "General",
    "country": "Paraguay",
    "countryFlag": "🇵🇾",
    "lang": "es",
    "url": "https://www.lanacion.com.py/feed/",
    "domain": "lanacion.com.py",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "par_pol_132",
    "name": "La Nación - Política",
    "category": "Política",
    "country": "Paraguay",
    "countryFlag": "🇵🇾",
    "lang": "es",
    "url": "https://www.lanacion.com.py/category/politica/feed/",
    "domain": "lanacion.com.py",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "par_eco_133",
    "name": "La Nación - Economía",
    "category": "Economía",
    "country": "Paraguay",
    "countryFlag": "🇵🇾",
    "lang": "es",
    "url": "https://www.lanacion.com.py/category/economia/feed/",
    "domain": "lanacion.com.py",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "par_dep_134",
    "name": "La Nación - Deportes",
    "category": "Deportes",
    "country": "Paraguay",
    "countryFlag": "🇵🇾",
    "lang": "es",
    "url": "https://www.lanacion.com.py/category/deportes/feed/",
    "domain": "lanacion.com.py",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "per_gen_135",
    "name": "El Comercio",
    "category": "General",
    "country": "Perú",
    "countryFlag": "🇵🇪",
    "lang": "es",
    "url": "https://elcomercio.pe/arc/outboundfeeds/rss/",
    "domain": "elcomercio.pe",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "per_gen_136",
    "name": "La República - Últimas noticias",
    "category": "General",
    "country": "Perú",
    "countryFlag": "🇵🇪",
    "lang": "es",
    "url": "https://larepublica.pe/rss/ultimas-noticias/",
    "domain": "larepublica.pe",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "per_gen_137",
    "name": "RPP - Últimas noticias",
    "category": "General",
    "country": "Perú",
    "countryFlag": "🇵🇪",
    "lang": "es",
    "url": "https://rpp.pe/rss/ultimas-noticias/",
    "domain": "rpp.pe",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "per_gen_138",
    "name": "OjoPúblico",
    "category": "General",
    "country": "Perú",
    "countryFlag": "🇵🇪",
    "lang": "es",
    "url": "https://ojo-publico.com/feed/",
    "domain": "ojo-publico.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "per_pol_139",
    "name": "La República - Política",
    "category": "Política",
    "country": "Perú",
    "countryFlag": "🇵🇪",
    "lang": "es",
    "url": "https://larepublica.pe/rss/politica/",
    "domain": "larepublica.pe",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "per_pol_140",
    "name": "RPP - Política",
    "category": "Política",
    "country": "Perú",
    "countryFlag": "🇵🇪",
    "lang": "es",
    "url": "https://rpp.pe/rss/politica/",
    "domain": "rpp.pe",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "per_pol_141",
    "name": "OjoPúblico - Política",
    "category": "Política",
    "country": "Perú",
    "countryFlag": "🇵🇪",
    "lang": "es",
    "url": "https://ojo-publico.com/category/politica/feed/",
    "domain": "ojo-publico.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "per_eco_142",
    "name": "La República - Economía",
    "category": "Economía",
    "country": "Perú",
    "countryFlag": "🇵🇪",
    "lang": "es",
    "url": "https://larepublica.pe/rss/economia/",
    "domain": "larepublica.pe",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "per_dep_143",
    "name": "La República - Deportes",
    "category": "Deportes",
    "country": "Perú",
    "countryFlag": "🇵🇪",
    "lang": "es",
    "url": "https://larepublica.pe/rss/deportes/",
    "domain": "larepublica.pe",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "per_dep_144",
    "name": "RPP - Deportes",
    "category": "Deportes",
    "country": "Perú",
    "countryFlag": "🇵🇪",
    "lang": "es",
    "url": "https://rpp.pe/rss/deportes/",
    "domain": "rpp.pe",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "per_tec_145",
    "name": "La República - Tecnología",
    "category": "Tecnología",
    "country": "Perú",
    "countryFlag": "🇵🇪",
    "lang": "es",
    "url": "https://larepublica.pe/rss/tecnologia/",
    "domain": "larepublica.pe",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "per_cul_146",
    "name": "La República - Cultura",
    "category": "Cultura",
    "country": "Perú",
    "countryFlag": "🇵🇪",
    "lang": "es",
    "url": "https://larepublica.pe/rss/cultura/",
    "domain": "larepublica.pe",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "rep_gen_147",
    "name": "Acento",
    "category": "General",
    "country": "República Dominicana",
    "countryFlag": "🇩🇴",
    "lang": "es",
    "url": "https://acento.com.do/feed/",
    "domain": "acento.com.do",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "rep_gen_148",
    "name": "Diario Libre - Últimas noticias",
    "category": "General",
    "country": "República Dominicana",
    "countryFlag": "🇩🇴",
    "lang": "es",
    "url": "https://www.diariolibre.com/rss/ultimas-noticias/",
    "domain": "diariolibre.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "rep_gen_149",
    "name": "Listín Diario",
    "category": "General",
    "country": "República Dominicana",
    "countryFlag": "🇩🇴",
    "lang": "es",
    "url": "https://www.listindiario.com/arc/outboundfeeds/rss/",
    "domain": "listindiario.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "rep_pol_150",
    "name": "Acento - Política",
    "category": "Política",
    "country": "República Dominicana",
    "countryFlag": "🇩🇴",
    "lang": "es",
    "url": "https://acento.com.do/category/politica/feed/",
    "domain": "acento.com.do",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "rep_pol_151",
    "name": "Diario Libre - Política",
    "category": "Política",
    "country": "República Dominicana",
    "countryFlag": "🇩🇴",
    "lang": "es",
    "url": "https://www.diariolibre.com/rss/politica/",
    "domain": "diariolibre.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "rep_eco_152",
    "name": "Acento - Economía",
    "category": "Economía",
    "country": "República Dominicana",
    "countryFlag": "🇩🇴",
    "lang": "es",
    "url": "https://acento.com.do/category/economia/feed/",
    "domain": "acento.com.do",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "rep_dep_153",
    "name": "Diario Libre - Deportes",
    "category": "Deportes",
    "country": "República Dominicana",
    "countryFlag": "🇩🇴",
    "lang": "es",
    "url": "https://www.diariolibre.com/rss/deportes/",
    "domain": "diariolibre.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "uru_gen_154",
    "name": "la diaria",
    "category": "General",
    "country": "Uruguay",
    "countryFlag": "🇺🇾",
    "lang": "es",
    "url": "https://ladiaria.com.uy/rss/",
    "domain": "ladiaria.com.uy",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "uru_gen_155",
    "name": "El País - Portada",
    "category": "General",
    "country": "Uruguay",
    "countryFlag": "🇺🇾",
    "lang": "es",
    "url": "https://www.elpais.com.uy/rss/portada/",
    "domain": "elpais.com.uy",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "uru_gen_156",
    "name": "El Observador - Últimas noticias",
    "category": "General",
    "country": "Uruguay",
    "countryFlag": "🇺🇾",
    "lang": "es",
    "url": "https://www.elobservador.com.uy/rss/ultimas-noticias/",
    "domain": "elobservador.com.uy",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "uru_gen_157",
    "name": "Montevideo Portal - Últimas noticias",
    "category": "General",
    "country": "Uruguay",
    "countryFlag": "🇺🇾",
    "lang": "es",
    "url": "https://www.montevideo.com.uy/rss/ultimas-noticias/",
    "domain": "montevideo.com.uy",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "uru_pol_158",
    "name": "la diaria - Política",
    "category": "Política",
    "country": "Uruguay",
    "countryFlag": "🇺🇾",
    "lang": "es",
    "url": "https://ladiaria.com.uy/rss/politica/",
    "domain": "ladiaria.com.uy",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "uru_pol_159",
    "name": "El País - Política",
    "category": "Política",
    "country": "Uruguay",
    "countryFlag": "🇺🇾",
    "lang": "es",
    "url": "https://www.elpais.com.uy/rss/politica/",
    "domain": "elpais.com.uy",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "uru_eco_160",
    "name": "la diaria - Economía",
    "category": "Economía",
    "country": "Uruguay",
    "countryFlag": "🇺🇾",
    "lang": "es",
    "url": "https://ladiaria.com.uy/rss/economia/",
    "domain": "ladiaria.com.uy",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "uru_eco_161",
    "name": "El País - Economía",
    "category": "Economía",
    "country": "Uruguay",
    "countryFlag": "🇺🇾",
    "lang": "es",
    "url": "https://www.elpais.com.uy/rss/economia/",
    "domain": "elpais.com.uy",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "uru_dep_162",
    "name": "El País - Deportes",
    "category": "Deportes",
    "country": "Uruguay",
    "countryFlag": "🇺🇾",
    "lang": "es",
    "url": "https://www.elpais.com.uy/rss/deportes/",
    "domain": "elpais.com.uy",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "uru_dep_163",
    "name": "Montevideo Portal - Deportes",
    "category": "Deportes",
    "country": "Uruguay",
    "countryFlag": "🇺🇾",
    "lang": "es",
    "url": "https://www.montevideo.com.uy/rss/deportes/",
    "domain": "montevideo.com.uy",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "uru_cul_164",
    "name": "El País - Cultura",
    "category": "Cultura",
    "country": "Uruguay",
    "countryFlag": "🇺🇾",
    "lang": "es",
    "url": "https://www.elpais.com.uy/rss/cultura/",
    "domain": "elpais.com.uy",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "ven_gen_165",
    "name": "El Nacional",
    "category": "General",
    "country": "Venezuela",
    "countryFlag": "🇻🇪",
    "lang": "es",
    "url": "https://www.elnacional.com/feed/",
    "domain": "elnacional.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "ven_gen_166",
    "name": "Efecto Cocuyo",
    "category": "General",
    "country": "Venezuela",
    "countryFlag": "🇻🇪",
    "lang": "es",
    "url": "https://efectococuyo.com/feed/",
    "domain": "efectococuyo.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "ven_gen_167",
    "name": "Tal Cual",
    "category": "General",
    "country": "Venezuela",
    "countryFlag": "🇻🇪",
    "lang": "es",
    "url": "https://talcualdigital.com/feed/",
    "domain": "talcualdigital.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "ven_gen_168",
    "name": "Runrun",
    "category": "General",
    "country": "Venezuela",
    "countryFlag": "🇻🇪",
    "lang": "es",
    "url": "https://runrun.es/feed/",
    "domain": "runrun.es",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "ven_gen_169",
    "name": "Prodavinci",
    "category": "General",
    "country": "Venezuela",
    "countryFlag": "🇻🇪",
    "lang": "es",
    "url": "https://prodavinci.com/feed/",
    "domain": "prodavinci.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "ven_pol_170",
    "name": "Efecto Cocuyo - Política",
    "category": "Política",
    "country": "Venezuela",
    "countryFlag": "🇻🇪",
    "lang": "es",
    "url": "https://efectococuyo.com/category/politica/feed/",
    "domain": "efectococuyo.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "ven_pol_171",
    "name": "Tal Cual - Política",
    "category": "Política",
    "country": "Venezuela",
    "countryFlag": "🇻🇪",
    "lang": "es",
    "url": "https://talcualdigital.com/category/politica/feed/",
    "domain": "talcualdigital.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "ven_pol_172",
    "name": "Runrun - Política",
    "category": "Política",
    "country": "Venezuela",
    "countryFlag": "🇻🇪",
    "lang": "es",
    "url": "https://runrun.es/category/politica/feed/",
    "domain": "runrun.es",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "ven_eco_173",
    "name": "El Nacional - Economía",
    "category": "Economía",
    "country": "Venezuela",
    "countryFlag": "🇻🇪",
    "lang": "es",
    "url": "https://www.elnacional.com/category/economia/feed/",
    "domain": "elnacional.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "ven_eco_174",
    "name": "Efecto Cocuyo - Economía",
    "category": "Economía",
    "country": "Venezuela",
    "countryFlag": "🇻🇪",
    "lang": "es",
    "url": "https://efectococuyo.com/category/economia/feed/",
    "domain": "efectococuyo.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "ven_dep_175",
    "name": "Efecto Cocuyo - Deportes",
    "category": "Deportes",
    "country": "Venezuela",
    "countryFlag": "🇻🇪",
    "lang": "es",
    "url": "https://efectococuyo.com/category/deportes/feed/",
    "domain": "efectococuyo.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "ven_tec_176",
    "name": "Efecto Cocuyo - Tecnología",
    "category": "Tecnología",
    "country": "Venezuela",
    "countryFlag": "🇻🇪",
    "lang": "es",
    "url": "https://efectococuyo.com/category/tecnologia/feed/",
    "domain": "efectococuyo.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "ven_cul_177",
    "name": "Prodavinci - Cultura",
    "category": "Cultura",
    "country": "Venezuela",
    "countryFlag": "🇻🇪",
    "lang": "es",
    "url": "https://prodavinci.com/category/cultura/feed/",
    "domain": "prodavinci.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "reddit_argentina",
    "name": "Reddit - r/argentina",
    "category": "🔴 Reddit & Comunidades",
    "country": "Argentina",
    "countryFlag": "🇦🇷",
    "lang": "es",
    "url": "https://www.reddit.com/r/argentina/.rss",
    "domain": "reddit.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "reddit_mexico",
    "name": "Reddit - r/mexico",
    "category": "🔴 Reddit & Comunidades",
    "country": "México",
    "countryFlag": "🇲🇽",
    "lang": "es",
    "url": "https://www.reddit.com/r/mexico/.rss",
    "domain": "reddit.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "reddit_chile",
    "name": "Reddit - r/chile",
    "category": "🔴 Reddit & Comunidades",
    "country": "Chile",
    "countryFlag": "🇨🇱",
    "lang": "es",
    "url": "https://www.reddit.com/r/chile/.rss",
    "domain": "reddit.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "reddit_colombia",
    "name": "Reddit - r/colombia",
    "category": "🔴 Reddit & Comunidades",
    "country": "Colombia",
    "countryFlag": "🇨🇴",
    "lang": "es",
    "url": "https://www.reddit.com/r/colombia/.rss",
    "domain": "reddit.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "reddit_technology",
    "name": "Reddit - r/technology",
    "category": "🔴 Reddit & Comunidades",
    "country": "Regional / Internacional",
    "countryFlag": "🌍",
    "lang": "es",
    "url": "https://www.reddit.com/r/technology/.rss",
    "domain": "reddit.com",
    "enabled": false,
    "isCustom": false
  },
  {
    "id": "reddit_gaming",
    "name": "Reddit - r/gaming",
    "category": "🔴 Reddit & Comunidades",
    "country": "Regional / Internacional",
    "countryFlag": "🌍",
    "lang": "es",
    "url": "https://www.reddit.com/r/gaming/.rss",
    "domain": "reddit.com",
    "enabled": false,
    "isCustom": false
  }
];

// Feeds por defecto según país seleccionado
function getDefaultFeedsForCountry(countryName = 'Argentina') {
  const matching = ALL_PRESET_FEEDS.filter(f => f.country === countryName || f.country === 'Regional / Internacional');
  if (matching.length > 0) {
    return matching.map(f => ({
      ...f,
      enabled: f.country === countryName && (f.category === 'General' || f.category === 'Noticias Generales')
    }));
  }
  return ALL_PRESET_FEEDS.slice(0, 10);
}

if (typeof globalThis !== 'undefined') {
  globalThis.COUNTRY_CATALOG = COUNTRY_CATALOG;
  globalThis.ALL_PRESET_FEEDS = ALL_PRESET_FEEDS;
  globalThis.getDefaultFeedsForCountry = getDefaultFeedsForCountry;
}
if (typeof window !== 'undefined') {
  window.COUNTRY_CATALOG = COUNTRY_CATALOG;
  window.ALL_PRESET_FEEDS = ALL_PRESET_FEEDS;
  window.getDefaultFeedsForCountry = getDefaultFeedsForCountry;
}
