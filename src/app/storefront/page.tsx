'use client';


import React, { useState } from 'react';
import { getProduct, filterProduct } from './helperFunction';

import { GlobalStyle, ButtonsContainer } from './styles';
import ProductButtons from './productButtons';

interface Product {
  description: string;
  category: string;
  quantity: number;
  photo: string;
  product_id: number;
  name: string;
  updated_at: Date;
}
// https://codesandbox.io/s/filter-with-react-button-r5x4i?file=/src/App.js
export default function App() {
  const buttons = [
    {
      name: 'All',
      value: 'All',
      count: 0,
    },
    {
      name: 'Dog',
      value: 'Dog',
      count: 1,
    },
    {
      name: 'Cat',
      value: 'Cat',
      count: 2,
    },
    {
      name: 'Misc.',
      value: 'Misc.',
      count: 3,
    },
  ];
  const [filtredProduct, setFiltredProducts] = useState<null | Product[]>(null);
  const [isClicked, setisClicked] = useState(false);

  return (
    <main>
      <GlobalStyle />
      <ButtonsContainer>
        {buttons.map((type, index) => (
          <ProductButtons
            key={type.count}
            value={type.value}
            setFiltredProducts={setFiltredProducts}
            content={type.name}
          />
        ))}
      </ButtonsContainer>
    </main>
  );
}
