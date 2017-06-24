#!/usr/bin/env node

const program = require('commander')
const gplay = require('google-play-scraper')

program
  .usage('<cmd> [options] \n\n  Refer to https://github.com/facundoolano/google-play-scraper')

program
  .command('app')
  .description('Retrieves the full detail of an application.')
  .option('-i, --app-id <app-id>', 'the Google Play id of the application (the ?id= parameter on the url).')
  .option('-l, --lang <lang>', '(optional, defaults to \'en\'): the two letter language code in which to fetch the app page. Human Language (hl)')
  .option('-c, --country <cc>', '(optional, defaults to \'us\'): the two letter country code used to retrieve the applications. Needed when the app is available only in some countries. Geo Location (gl)')

  .action(args => {
    const options = (({ appId, lang, country }) => ({ appId, lang, country }))(args)
    gplay.app(options)
      .then(handle_result, handle_error)
  })

program
  .command('list')
  .description('Retrieves a list of applications from one of the collections at Google Play.')
  .option('--collection <COL>', '(optional, defaults to TOP_FREE): the Google Play collection that will be retrieved. (TOP_FREE, TOP_PAID, ...).')
  .option('--category <CAT>', '(optional, deafaults to no category): the app category to filter by (ANDROID_WEAR, ART_AND_DESIGN, ...).')
  .option('-a, --age <n>', '(optional, defaults to no age filter): the age range to filter the apps (only for FAMILY and its subcategories). Available options are FIVE_UNDER, SIX_EIGHT, NINE_UP.')
  .option('-n, --num <n>', '(optional, defaults to 60, max is 120): the amount of apps to retrieve.', parseInt)
  .option('-S, --start <n>', '(optional, defaults to 0, max is 500): the starting index of the retrieved list.', parseInt)
  .option('-l, --lang <lang>', '(optional, defaults to \'en\'): the two letter language code in which to fetch the app page. Human Language (hl)')
  .option('-c, --country <cc>', '(optional, defaults to \'us\'): the two letter country code used to retrieve the applications. Needed when the app is available only in some countries. Geo Location (gl)')
  .option('-F, --full-detail', '(optional, defaults to false): if true, an extra request will be made for every resulting app to fetch its full detail.')

  .action(args => {
    const options = (({ collection, category, age, num, start, lang, country, fullDetail }) => ({ collection, category, age, num, start, lang, country, fullDetail }))(args)
    options.collection = gplay.collection[options.collection]
    options.category = gplay.category[options.collection]
    gplay.list(options)
      .then(handle_result, handle_error)
  })

program
  .command('search')
  .description('Retrieves a list of apps that results of searching by the given term.')
  .option('-t, --term <term>', 'the term to search by.')
  .option('-n, --num <n>', '(optional, defaults to 20, max is 250): the amount of apps to retrieve.', parseInt)
  .option('-l, --lang <lang>', '(optional, defaults to \'en\'): the two letter language code in which to fetch the app page. Human Language (hl)')
  .option('-c, --country <cc>', '(optional, defaults to \'us\'): the two letter country code used to retrieve the applications. Needed when the app is available only in some countries. Geo Location (gl)')
  .option('-F, --full-detail', '(optional, defaults to false): if true, an extra request will be made for every resulting app to fetch its full detail.')
  .option('-P, --price <price>', `(optional, defaults to all): allows to control if the results apps are free, paid or both.
                                   all: Free and paid
                                   free: Free apps only
                                   paid: Paid apps only\n`)

  .action(args => {
    const options = (({ term, num, lang, country, fullDetail, price }) => ({ term, num, lang, country, fullDetail, price }))(args)
    gplay.search(options)
      .then(handle_result, handle_error)
  })

program
  .command('developer')
  .description('Returns the list of applications by the given developer name.')
  .option('-d, --dev-id <developer name>', 'the name of the developer.')
  .option('-l, --lang <lang>', '(optional, defaults to \'en\'): the two letter language code in which to fetch the app page. Human Language (hl)')
  .option('-c, --country <cc>', '(optional, defaults to \'us\'): the two letter country code used to retrieve the applications. Needed when the app is available only in some countries. Geo Location (gl)')
  .option('-n, --num <n>', '(optional, defaults to 20): the amount of apps to retrieve.', parseInt)
  .option('-F, --full-detail', '(optional, defaults to false): if true, an extra request will be made for every resulting app to fetch its full detail.')

  .action(args => {
    const options = (({ devId, lang, country, num, fullDetail }) => ({ devId, lang, country, num, fullDetail }))(args)
    gplay.developer(options)
      .then(handle_result, handle_error)
  })

program
  .command('suggest')
  .description('Given a string returns up to five suggestion to complete a search query term.')
  .option('-t, --term <term>', 'the term to search by.')

  .action(args => {
    const options = (({ term }) => ({ term }))(args)
    gplay.suggest(options)
      .then(handle_result, handle_error)
  })

program
  .command('reviews')
  .description('Retrieves a page of reviews for a specific application.')
  .option('-i, --app-id <app-id>', 'Unique application id for Google Play.')
  .option('-l, --lang <lang>', '(optional, defaults to \'en\'): the two letter language code in which to fetch the app page. Human Language (hl)')
  .option('-s, --sort <SORT>', '(optional, defaults to NEWEST): The way the reviews are going to be sorted. Accepted values are: NEWEST, RATING and HELPFULNESS.')
  .option('-p, --page <n>', '(optional, defaults to 0): Number of page that contains reviews. Every page has 40 reviews at most.', parseInt)

  .action(args => {
    const options = (({ appId, lang, sort, page }) => ({ appId, lang, sort, page }))(args)
    options.sort = gplay.sort[options.sort]
    gplay.reviews(options)
      .then(handle_result, handle_error)
  })

program
  .command('similar')
  .description('Returns a list of similar apps to the one specified.')
  .option('-i, --app-id <app-id>', 'Unique application id for Google Play.')
  .option('-l, --lang <lang>', '(optional, defaults to \'en\'): the two letter language code in which to fetch the app page. Human Language (hl)')
  .option('-F, --full-detail', '(optional, defaults to false): if true, an extra request will be made for every resulting app to fetch its full detail.')

  .action(args => {
    const options = (({ appId, lang, fullDetail }) => ({ appId, lang, fullDetail }))(args)
    gplay.similar(options)
      .then(handle_result, handle_error)
  })

program
  .command('permissions')
  .description('Returns the list of permissions an app has access to.')
  .option('-i, --app-id <app-id>', 'Unique application id for Google Play.')
  .option('-l, --lang <lang>', '(optional, defaults to \'en\'): the two letter language code in which to fetch the app page. Human Language (hl)')
  .option('--short', '(optional, defaults to false): if true, the permission names will be returned instead of permission/description objects.')

  .action(args => {
    const options = (({ appId, lang, short }) => ({ appId, lang, short }))(args)
    gplay.permissions(options)
      .then(handle_result, handle_error)
  })

function handle_result(res){
  console.log(JSON.stringify(res))
  process.exit(0)
}
function handle_error(err){
  console.error(err)
  process.exit(1)
}

program.parse(process.argv)
