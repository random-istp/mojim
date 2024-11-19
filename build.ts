import { Glob } from "bun"

const glob = new Glob('archive.ph_*.html')

interface Link {
  title: string
  url: string
}

const links: Link[] = []


for (const file of glob.scanSync('./docs')) {
  const title = (await Bun.file(`./docs/${file}`).text()).match(/<title>(.*?)<\/title>/)?.[1].replace(/※.*$/, '') ?? ''

  const link = `./${file}`

  links.push({
    title,
    url: link
  })

  console.log(link, title)
}

const template = await Bun.file('./template.html').text()

const injectedHtml = template.replace('{REPLACE_ME}', links.map(link => `<li><a href="${link.url}" title="${link.title}" class="file html">${link.title}</a></li>`).join(''))

await Bun.write('./docs/index.html', injectedHtml)
