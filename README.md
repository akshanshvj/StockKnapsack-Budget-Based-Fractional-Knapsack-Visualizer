# StockKnapsack: Budget-Based Fractional Knapsack Visualizer

StockKnapsack is a modern interactive web app that explains the Fractional Knapsack Problem using a stock market investment example.

In this model, the user has a fixed investment budget. Each stock is treated as an item, where the purchase value is the investment amount, the expected profit is the value, and the profit-per-rupee ratio determines priority.

## Live Concept

- Knapsack capacity = total budget
- Item weight = stock purchase value / investment amount
- Item value = expected profit
- Ratio = expected profit per rupee invested

The goal is to maximize total expected profit using the Fractional Knapsack greedy algorithm.

## Features

- Add, edit, and delete stock rows
- Enter total investment budget
- Calculate profit-per-rupee ratio automatically
- Sort stocks by highest expected profit per rupee
- Run step-by-step Fractional Knapsack visualization
- Animated budget bar showing selected investments
- Full and fractional investment messages
- Live updates for remaining budget, investment taken, fraction taken, profit gained, and total expected profit
- Final output table with selected stocks and profit gained
- Built-in JavaScript algorithm code display
- Current algorithm line highlighting during visualization
- Responsive glassmorphism UI

## Fractional Knapsack Logic

The algorithm works as follows:

1. Calculate profit-per-rupee ratio for each stock.
2. Sort stocks in descending order of ratio.
3. Pick the stock with the highest ratio first.
4. If the remaining budget can cover the full purchase value, invest fully.
5. If the remaining budget is less than the purchase value, invest fractionally.
6. Calculate profit gained from the selected fraction.
7. Stop when the budget becomes zero.

## 0/1 Knapsack vs Fractional Knapsack

| Type | Meaning |
| --- | --- |
| 0/1 Knapsack | Invest fully in a stock or skip it |
| Fractional Knapsack | Invest partially if remaining budget is not enough |

## Tech Stack

- React
- Tailwind CSS
- Framer Motion
- Vite
- Lucide React Icons

## Installation

```bash
npm install
npm run dev
```

Open the app at:

```bash
http://127.0.0.1:5173
```

## Build

```bash
npm run build
```

## Project Structure

```bash
src/
  App.jsx
  main.jsx
  styles.css
index.html
package.json
tailwind.config.js
postcss.config.js
```

## Educational Purpose

This project is designed to help students understand how the greedy approach solves the Fractional Knapsack Problem by using a relatable stock investment scenario.
