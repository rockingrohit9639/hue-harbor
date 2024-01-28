# Plan for Hue Harbor

## Website

A website model will represent a user's website. User can create website in our project, then he/she can assign color palates or can customize already assigned palates.

## Palate

A palate can have different variables. These variables can either be a string (color) or a number.

- Color

  - Color can be used for background or text colors on website

- Number

  - Number variables in a palate can use used for things like fontSize, borderRadius etc.

## Predefined palates

There will be some predefined palates in the from which a user can select and use in their website.
In future, we can integrate AI to suggest color palates based on the website's descriptions.

## How are we going to provide the palate to use in projects ?

There are different ways by which we can deliver the palates to user. We have to explore and find the best solution.

Solutions that are currently in my mind -

- Create a tailwindcss plugin which will basically take some parameters and will inject the variables in tailwind config dynamically.
- Provide a CDN url which user can inject in their website in <head> using <link> tag. This will provide a css file with all the variables defined in the palate.
- Create a very basic npm package in which there will be a function which will fetch the palate and will dynamically update the variables in `document`
