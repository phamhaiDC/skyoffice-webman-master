# Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

<br/>

# Run the app

## Prerequisites

- node
- yarn

## Installation

```bash
yarn
```

## Environment

Create a file named `.env`, then copy the content from `.env.sample`. You can do it by:

```bash
cp .env.sample .env
```

Add the real environment variables into `.env`

## Run

```bash
yarn start
```

## Production

```bash
yarn build
serve -s build
```

<br/>

# Libraries and Ideology

## Libraries

## [typescript](https://www.typescriptlang.org/)

### [react-router-dom@6](https://reactrouter.com/docs/en/v6/getting-started/overview): routing.

### [zustand](https://github.com/pmndrs/zustand): state-management solution using simplified flux principles.

### [react-query](https://react-query.tanstack.com/): fetch, cache and update data in the app all without touching any "global state"

### [react-hook-form](https://react-hook-form.com/): form data management and validation

### [antd](https://ant.design/components/overview/): UI components library

### [tailwindcss](https://tailwindcss.com/): utility-first CSS framework

### [styled-components](https://styled-components.com/): customize React component's CSS

<br/>

## Ideology

### 1. Global states:

- all API-related states (params, payload, list, detail, cache) are handled by [react-query](https://react-query.tanstack.com/)
- the rest is handled by [zustand](https://github.com/pmndrs/zustand)

### 2. Form

_We have clear separation between form's UI and state._

- UI: [antd](https://ant.design/components/overview/)
- state: [react-hook-form](https://react-hook-form.com/)

### 3. Style

_We follow this prioritized list for styling components:_<br/>
`antd > tailwindcss > styled-components`
