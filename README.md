# Hue Harbor 🎨

Hue Harbor is a versatile color palette management platform designed to streamline the process of creating, customizing, and integrating color palettes into your projects. Whether you're a designer, developer, or creative enthusiast, Hue Harbor provides the tools you need to bring your projects to life with vibrant colors and effortless creativity.

## Features 🚀

- **Create Custom Color Palettes**: Easily create personalized color palettes using our intuitive interface and advanced color tools.
- **Manage Your Palettes**: Organize, edit, and customize your color palettes with ease, ensuring consistency across your projects.
- **Explore Public Palettes**: Discover a curated collection of inspiring color combinations contributed by our creative community.
- **Seamless Integration**: Integrate your palettes into your projects effortlessly using our provided CDN or APIs.
- **Collaborate with Ease**: Share your palettes with team members or clients and collaborate on projects in real-time.

## Usage

### Using CDN

To use your palettes in your projects using CDN you can use any one of the following methods.

1. Using website id

- Make sure you have website id with you, then include the following tag inside <head> of your html document

```html
<link rel="stylesheet" href="https://hue-harbor.imrohitsaini.in/api/cdn/website/<YOUR-WEBSITE-ID>" />
```

2. Using palette slug

- Make sure you have slug of your palette with you. Then add the following html

```html
<link rel="stylesheet" href="https://hue-harbor.imrohitsaini.in/api/cdn/palette/<YOUR-PALETTE-SLUG>" />
```

\*_**Note**_ You can use CDN for PUBLIC palettes only

### Using APIs

We have created few APIs to meet your needs. If you are using any framework which supports hooks then you can create a hook like below in your project and can use accordingly.

```ts
import { useCallback, useEffect, useState } from 'react'

type UseHueHarborProps = {
  apiKey: string // you can create and get API key from your dashboard
  paletteSlug: string
}

/**
 * This hook will fetch and insert all css variables from a palette
 * into your DOM :root
 */
type Response = {
  message: string
  data: Array<{ variableName: string; value: string }>
}

export default function useHueHarbor({ apiKey, paletteSlug }: UseHueHarborProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [variables, setVariables] = useState<Response['data']>([])

  const fetchAndUpdateCSS = useCallback(() => {
    setIsLoading(true)
    fetch(`https://hue-harbor.imrohitsaini.in/api/cdn/raw/${paletteSlug}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
      .then((res) => res.json())
      .then((res: Response) => {
        res.data.forEach((variable) => {
          document.body.style.setProperty(variable.variableName, variable.value)
        })

        setVariables(res.data)
      })
      .catch(() => {
        setError('Something went wrong!')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [apiKey, paletteSlug])

  useEffect(
    function fetchVariables() {
      fetchAndUpdateCSS()
    },
    [fetchAndUpdateCSS],
  )

  return {
    isLoading,
    error,
    variables,
  }
}
```

## Getting Started 🌟

To get started with Hue Harbor, follow these simple steps:

1. **Sign Up**: Create your account at [Hue Harbor](hue-harbor.imrohitsaini.in/auth/login).
2. **Explore Public Palettes**: Browse through our curated collection of public palettes for inspiration.
3. **Create Your Palette**: Use our intuitive tools to create your custom color palette or import existing ones.
4. **Integrate with Your Projects**: Easily integrate your palettes into your websites, apps, or designs using our provided CDN or APIs.

## Installation 💻

To install Hue Harbor locally, follow these steps:

1. Clone the repository: `https://github.com/rockingrohit9639/hue-harbor`
2. Navigate to the project directory: `cd hue-harbor`
3. Install dependencies: `pnpm install`
4. Add required environment variables
5. Start the development server: `pnpm dev`

## Contributing 🤝

We welcome contributions from the community! If you'd like to contribute to Hue Harbor, please follow these guidelines:

1. Fork the repository and create your branch: `git checkout -b feature/new-feature`
2. Commit your changes: `git commit -am 'Add new feature'`
3. Push to the branch: `git push origin feature/new-feature`
4. Submit a pull request with your changes.

## License 📄

This project is licensed under the [MIT License](LICENSE).
