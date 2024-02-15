import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPaletteCdnContent(slug: string) {
  return `
- Insert the following code in <head> of your html and you are good to go

~~~html
<link rel="stylesheet" href="https://hue-harbor.imrohitsaini.in/api/cdn/palette/${slug}" />
~~~
`
}

export function getWebsiteCdnContent(id: string) {
  return `
- Insert the following code in <head> of your html and you are good to go

~~~html
<link rel="stylesheet" href="https://hue-harbor.imrohitsaini.in/api/cdn/website/${id}" />
~~~

- If you are using a private palette, then use the following CDN

*Note: Don't forget to replace <YOUR-API-KEY> with your own api key generated from "My Api Keys"

~~~html
<link rel="stylesheet" href="https://hue-harobor.imrohitsaini.in/api/cdn/css/${id}?key=<YOUR-API-KEY>" >
~~~
`
}
