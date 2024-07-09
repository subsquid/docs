var error = false

function test(condition, message, exitOnFailure=false) {
  if (!condition) {
    console.error(message)
    error = true
    if (exitOnFailure) {
      process.exit(1)
    }
  }
}

test(process.argv[2]!=null, 'Please supply the path to the tags JSON', true)
const tagsJson = JSON.parse(require('fs').readFileSync(process.argv[2]))

// Extracting tags proper

const tags = new Set(tagsJson.tags.map(r => r.id))

const categoryTags = tagsJson.categories.map(cr => new Set(cr.tags))
const allCategoryTags = categoryTags.reduce((a, v) => a.union(v), new Set())

const cardsTags = new Set()
for (let c of tagsJson.cards) {
  for (let t of c.tags) {
    cardsTags.add(t)
  }
}

// Each individual tags must have a description

for (let t of tagsJson.tags) {
  test(t.description!=null, `Missing description for tag ${t.id}`)
}

// tags, cardTags and allCategoryTags must all be equal

test(tags.difference(allCategoryTags).size===0, `Base tags [${[...tags.difference(allCategoryTags)]}] are not listed in any categories`)
test(allCategoryTags.difference(tags).size===0, `Category tags [${[...allCategoryTags.difference(tags)]}] are not listed as base tags`)

test(tags.difference(cardsTags).size===0, `Base tags [${[...tags.difference(cardsTags)]}] are not listed on any card`)
test(cardsTags.difference(tags).size===0, `Cards tags [${[...cardsTags.difference(tags)]}] are not listed as base tags`)

// tags categories must be disjoint

for (let cti of categoryTags) {
  for (let ctj of categoryTags) {
    if (cti!==ctj) { // as references
      test(cti.intersection(ctj).size===0, `Tags [${[...cti.intersection(ctj)]}] are present in more than one category`)
    }
  }
}

if (error) {
  process.exit(1)
}
