# Frontend Developer Coding Assignment

### Purpose

The purpose of this exercise is to give us an example of your work within bounds, guildelines and specifications suppled to you. It provides us some insight into how you work, how you think, and how you build things. It also provides the opportunity for multiple discussion points during an interview. Hopefully this is also fun!

### The Ask

We would like you to build a React app that consumes a public API. The public API consists of two endpoints:

- A pageable endpoint that allows for searching
- An endpoint that accepts an id, and provides details on a specific object

The React app should match as closely as possible the design found in this [Figma](https://www.figma.com/design/au6L5XqQ0VjanC9dlgdlmI/Dev-Homework?node-id=2532-2&m=dev&t=xoqFPCWRT0d9yNZp-1). If you want access to pixel perfect measurements, you'll need to log into Figma with an account you create or already have.

### Requirements

- Clone this repo as a starting point for the assignment. It was created using [Create React App](https://create-react-app.dev/) and has been configured with [Typescript](https://www.typescriptlang.org/) and [TailwindCSS](https://tailwindcss.com/).
- You can build this with any node modules or services you see fit.
- We have included the [Jest](https://jestjs.io/) test framework for your convenience and expect to see tests that exercise the behavior of the code you write.
- We have included the assets for the Figma design in the `src/assets` folder.

### Specifications

The search endpoint is defined as follows:

`GET http://localhost:4000/api/search?index=<number>&limit=<number>&query=<string>`

Parameters:

**index**: A numerical index that represents the offset to start returning results from. Default 0.

**limit**: A numerical limit on results to return. Default 10.

**query**: A string to query for results. This searches the **name** of a cocktail recipe inclusively, as in, 'rita' finds 'Margarita'. An empty query string returns an array of unfiltered results.

The response format looks like this:

```
{
  "drinks":
    [
      {
        "id": 1234,
        "name": "Aztec Punch",
        "category": "Punch Party Drink",
        "image": "https://www.thecocktaildb.com/images/media/drink/uqwuyp1454514591.jpg"
      },
      ...
   ],
   "totalCount": 1234
}
```

The details endpoint is defined as follows:

`GET http://localhost:4000/api/detail?id=<number>`

Parameters:

**id**: This should be an identifier of a cocktail recipe record.

The response format looks like this:

```
{
  "drinks":
    [
      {
        "id": 1234,
        "name": "Aztec Punch",
        "category": "Punch Party Drink",
        "container": "Punch bowl",
        "instructions": "Mix all ingredients in a pitcher. Mix thoroughly and pour into whatever is available, the bigger the better! This drink packs a big punch, so don't over do it.",
        "image": "https://www.thecocktaildb.com/images/media/drink/uqwuyp1454514591.jpg",
        "ingredients" : [
          {
            "name" : "Lemonade",
            "measurement": "1 can"
          },
          ...
        ]
      }
   ]
}
```

### Resources

The data returned by the public API is based on the free api at [The Cocktail DB](https://www.thecocktaildb.com), because why can't work be fun? :) To run the public API locally, follow the instructions in this [repository](https://github.com/zeemee/zeemee-public-api).

### Submission

We're flexible in how you submit your work. If you want to .zip it up and email it, that's fine, if you want to create a private github account and submit a link to a repo, that's fine too.

### Thoughts and Notes

This is just an exercise. While the methods and approaches you take to problems should be indicative of how you would approach a problem in a production environment, we don't expect any over-the-top work here. Don't spend tons of time on it. If you think something really needs a complex solution that would take a lot of work, implement a lesser solution, write a note in comments about a proper solution, and we can discuss it.

# Cocktail Search Application - Details

### by Mark Fasel

## Overview

A React-based cocktail search application that allows users to discover and explore cocktail recipes. Built with TypeScript, React, and modern web development practices.

## Features

- 🔍 Real-time cocktail search
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS
- 📊 Pagination support
- 🔄 URL-based state management
- 🧪 Comprehensive test coverage
- 🚀 Performance optimized

## Technical Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Express.js
- **Testing**: Jest, React Testing Library
- **State Management**: URL-based with React Router
- **Styling**: Hybrid approach (Tailwind + SCSS)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

`bash`

### Clone the repository

`git clone [repository-url]`

### Install dependencies

`npm install`

### Start the development server

`npm start`

### Start the API server (in a separate terminal)

`cd server`
`npm install`
`npm start`

## API Integration

The application integrates with TheCocktailDB API through a proxy server that:

- Handles rate limiting
- Provides consistent error handling
- Implements pagination
- Standardizes response formats

### API Endpoints

- `/api/search` - Search cocktails by name
- `/api/cocktail/:id` - Get detailed cocktail information
- `/api/popular` - Fetch popular cocktails
- `/api/ingredients/search` - Search ingredients

## Design Decisions

### 1. State Management

Chose URL-based state management over Redux/Context for:

- Shareable search results
- Browser history integration
- Simplified state persistence

### 2. Styling Approach

Implemented a hybrid styling solution:

- Tailwind CSS for rapid UI development
- SCSS for custom components
- CSS Modules for component isolation

### 3. Type Safety

- Comprehensive TypeScript implementation
- Strict type checking
- Interface-driven development

### 4. Testing Strategy

- Unit tests for utilities
- Integration tests for API
- Component testing with React Testing Library

## Planned Enhancements

### 1. Advanced Filtering

Started implementing but paused due to time constraints:

- Filter by category (Cocktail/Ordinary Drink)
- Filter by alcohol content
- Multiple filter combination

### 2. Performance Optimizations

- Image lazy loading
- Component code splitting
- API response caching

### 3. Additional Features

- User favorites
- Recipe sharing
- Print-friendly view
- Mobile app conversion potential

## Development Process

### Phase 1: Core Implementation

- Set up project structure
- Implemented basic search
- Added pagination
- Established testing framework

### Phase 2: UI/UX Enhancement

- Responsive design implementation
- Loading states
- Error handling
- Accessibility improvements

### Phase 3: Advanced Features (Partial)

- Started filter implementation
- Began work on advanced search
- Initiated performance optimizations

## Challenges & Solutions

### 1. Type Safety vs Flexibility

- Challenge: Balancing strict typing with API responses
- Solution: Created intermediate interfaces and type guards

### 2. State Management

- Challenge: Complex filter state management
- Solution: URL-based state with custom hooks

### 3. Performance

- Challenge: Large dataset handling
- Solution: Implemented pagination and lazy loading

## Future Improvements

### 1. Technical Debt

- Refactor filter implementation
- Improve error boundary coverage
- Enhance test coverage
- Remove unused dependencies
- Add more tests
- Add more documentation
- Clean up comments
- Reduce code duplication and improve readability (as needed)
- Remove console logs and other unnecessary debugging statements

### 2. Feature Additions

- Advanced sorting options
- User authentication
- Recipe collections
- Social sharing

### 3. Performance

- Server-side rendering
- Progressive Web App features
- API response caching

## Contributing

Contributions are welcome! Please read our contributing guidelines and code of conduct.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- TheCocktailDB for the API
- React community for inspiration and resources
- Team members and reviewers for feedback

### Loom Video Overviews of the Working Product and Brief Overview of the Code

- https://www.loom.com/share/dcc2e40f713f435481464fe26b1cf12e?sid=510d95c9-611f-4e31-bf4b-f3c19eafc211
- https://www.loom.com/share/b590686a8eca423b90e7f22f1399f3ea?sid=cd772eb9-704e-45b9-a65b-d112406cb05c
- https://www.loom.com/share/deaf2f8af7654ae0810772166504b350?sid=b599d0ea-c55c-4ff6-a3f4-e416be7eb0cd
- https://www.loom.com/share/f489356ff7ac4c25922a71bddb1a5024?sid=0edfb040-9981-42ed-ad28-dfcd19380532
- https://www.loom.com/share/81385187423949388bfaec3b629f0bf8?sid=ea6523dd-dd7d-457f-9bf3-b53129c713fb
