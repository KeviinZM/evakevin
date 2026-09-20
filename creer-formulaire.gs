/**
 * ═══════════════════════════════════════════════════════════════
 *  CRÉATION AUTOMATIQUE DU GOOGLE FORM DU MARIAGE
 * ═══════════════════════════════════════════════════════════════
 *
 *  MODE D'EMPLOI (2 minutes, une seule fois)
 *
 *  1. Va sur  https://script.google.com/home/projects/create
 *  2. Efface tout le code affiché, colle CE fichier à la place.
 *  3. Clique sur « Exécuter » (▶).
 *  4. Google demande une autorisation :
 *     « Examiner les autorisations » → choisis ton compte →
 *     « Paramètres avancés » → « Accéder à ... (non sécurisé) » → « Autoriser ».
 *     (C'est normal : le script n'est pas « vérifié » par Google
 *      puisque c'est toi qui viens de l'écrire.)
 *  5. En bas, le « Journal d'exécution » affiche un bloc de code.
 *     Copie-le et colle-le dans index.html à la place de CONFIG.form.
 *
 *  Le script crée :
 *   • le formulaire avec les 12 champs
 *   • la Google Sheet reliée (les réponses y arrivent automatiquement)
 *   • et te donne les identifiants dont le site a besoin.
 * ═══════════════════════════════════════════════════════════════
 */

function creerFormulaireMariage() {

  // ---- Renomme ici si tu veux -----------------------------------
  var TITRE_FORM  = 'Mariage — Coordonnées des invités';
  var TITRE_SHEET = 'Mariage — Réponses des invités';
  // ---------------------------------------------------------------

  var champs = [
    ['prenom',     'Prénom',                  'court'],
    ['nom',        'Nom',                     'court'],
    ['email',      'Email',                   'court'],
    ['tel',        'Téléphone',               'court'],
    ['adresse',    'Adresse',                 'court'],
    ['complement', "Complément d'adresse",    'court'],
    ['cp',         'Code postal',             'court'],
    ['ville',      'Ville',                   'court'],
    ['pays',       'Pays',                    'court'],
    ['adultes',    "Nombre d'adultes",        'court'],
    ['enfants',    "Nombre d'enfants",        'court'],
    ['mot',        'Un petit mot',            'long']
  ];

  var form = FormApp.create(TITRE_FORM);
  form.setDescription('Réponses collectées depuis le site Save the Date.');
  form.setCollectEmail(false);
  form.setAcceptingResponses(true);
  form.setAllowResponseEdits(false);
  form.setLimitOneResponsePerUser(false);

  // Les champs sont volontairement NON obligatoires côté Google :
  // c'est le site qui valide. Un champ obligatoire vide ferait
  // échouer l'envoi en silence.
  var items = champs.map(function (c) {
    var item = (c[2] === 'long')
      ? form.addParagraphTextItem().setTitle(c[1]).setRequired(false)
      : form.addTextItem().setTitle(c[1]).setRequired(false);
    return { cle: c[0], item: item };
  });

  // Google Sheet reliée
  var ss = SpreadsheetApp.create(TITRE_SHEET);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  // Récupération des identifiants "entry.XXXXX" de chaque champ,
  // via une URL pré-remplie générée champ par champ (méthode exacte).
  var entries = items.map(function (o) {
    var url = form.createResponse()
                  .withItemResponse(o.item.createResponse('x'))
                  .toPrefilledUrl();
    var found = url.match(/entry\.\d+/);
    return { cle: o.cle, id: found ? found[0] : 'INTROUVABLE' };
  });

  var viewUrl   = form.getPublishedUrl();
  var actionUrl = viewUrl.replace(/\/viewform.*$/, '/formResponse');

  // ---- Bloc prêt à coller dans index.html ------------------------
  var bloc = [];
  bloc.push('  form: {');
  bloc.push("    actionUrl: '" + actionUrl + "',");
  bloc.push("    viewUrl:   '" + viewUrl + "',");
  bloc.push('    entries: {');
  entries.forEach(function (e, i) {
    var virgule = (i < entries.length - 1) ? ',' : '';
    var pad = '          '.substring(0, Math.max(1, 11 - e.cle.length));
    bloc.push("      " + e.cle + ":" + pad + "'" + e.id + "'" + virgule);
  });
  bloc.push('    }');
  bloc.push('  }');

  var sortie = [
    '',
    '════════════════════════════════════════════════════════════',
    '  ✅ FORMULAIRE CRÉÉ',
    '════════════════════════════════════════════════════════════',
    '',
    '  Formulaire  : ' + form.getEditUrl(),
    '  Réponses    : ' + ss.getUrl(),
    '',
    '════════════════════════════════════════════════════════════',
    '  ⬇️  COPIE LE BLOC CI-DESSOUS DANS index.html',
    '     (il remplace tout le bloc « form: { ... } » de CONFIG)',
    '════════════════════════════════════════════════════════════',
    '',
    bloc.join('\n'),
    '',
    '════════════════════════════════════════════════════════════'
  ].join('\n');

  Logger.log(sortie);
  return sortie;
}
