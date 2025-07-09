import { todoReducer } from "./reducer";
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore(
    {
        reducer: todoReducer,
    }
)


