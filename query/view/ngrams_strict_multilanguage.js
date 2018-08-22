var peliasQuery = require('pelias-query');

/**
  Ngrams view with the additional properties to enable:
  type:phrase -> tokens MUST appear in the same order in BOTH query and index
  operator:and -> ALL tokens are mandatory, missing any single token will cause
  a query failure.
**/

const logger = require('pelias-logger').get('ngram_strict_multilanguage');

module.exports = function( vs ){

  // validate required params
  if( !vs.isset('phrase:slop') ){
    return null;
  }

  var langNameField = 'name.' + vs.var('lang');
  var view = peliasQuery.view.multi_match(
    vs,
    [
      {'field': langNameField, 'boost': 2},
      {'field': 'name.default', 'boost': 1}
    ],
    vs.var('ngram:analyzer'),
    'input:name'
  );

  view.multi_match.type = 'phrase';
  view.multi_match.operator = 'and';

  return view;
};
