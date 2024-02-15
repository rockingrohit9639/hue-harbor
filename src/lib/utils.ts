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

`
}
