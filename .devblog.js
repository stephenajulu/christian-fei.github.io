const CleanCSS = require("clean-css")
const [commitLong, date, ...commitDescription] = require('child_process').execSync(`git log -1 --no-color`)
  .toString()
  .split('\n')
  .filter(Boolean)
  .map(l => l.trim())
  .filter(l => !l.startsWith('Author:'))
const commit = commitLong.replace(/^commit /, '').substring(0, 7)

module.exports = {
  ignoredFiles: ['secrets', 'secrets.example', 'scripts/*'],
  collections: {
    books: require('./_data/books.json'),
    contributionsByDay: require('./_data/contributions.json'),
    contributionsByYear: require('./_data/years.json'),
    pocketItems: require('./_data/pocket.json').items,
  },

  nunjucksFilters: [{
    name: 'cssmin',
    filter: (code) => new CleanCSS({}).minify(code).styles
  }, {
    name: 'words',
    filter: (content) => (content || '').split(' ').length
  }, {
    name: 'tags',
    filter: (tags) => tags.filter(t => !['post', 'featured', 'tutorial'].includes(t))
  }, {
    name: 'year',
    filter: () => new Date().getFullYear()
  }, {
		name: 'commit',
		filter: ()  => commit
  }, {
		name: 'githubCommitDiffUrl',
    filter: () => `https://github.com/christian-fei/christian-fei.github.io/commit/${commit}`
  }, {
    name: 'readingTime',
    filter: (content) => {
      const words = (content || '').split(' ').length
      const averageWPM = 250
      const readingTimeInMinutes  = words / averageWPM * 2
      const minutes = parseInt(readingTimeInMinutes, 10)
      return minutes > 1 ? `${minutes} minutes` : `1 minute`
    }
  }, {
    name: 'excerpt',
    filter: (content) => (content || '').substring(0, 500).replace(/<\/?[^>]+(>|$)/g, "")
  }, {
    name: 'twitterTitle',
    filter: (title) => `"${encodeURIComponent(title || '')}", by @christian_fei`
  }, {
    name: 'encode',
    filter: (content) => encodeURIComponent(content || '')
  }, {
    name: 'json',
    filter: (obj) => {
      try {
        // console.log('json -> ', obj)
        return JSON.stringify(obj || {}, null, 2)
      } catch (err) {
        console.error(err.message, obj)
        return obj
      }
    }
  }, {
    name: 'printdate',
    filter: (date) => {
      try {
        return new Date(date).toISOString().substring(0, 10)
      } catch (err) {
        return JSON.stringify(date || {})
      }
    }
  }, {
    name: 'isoday',
    filter: (date) => {
      try {
        return date.toISOString().substring(0, 10)
      } catch (err) {
        return date
        return JSON.stringify(date || {})
      }
    }
	}],
}