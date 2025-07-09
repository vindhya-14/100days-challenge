import { ADD_TODO, DELETE_TODO } from "./actions";

const initialState = {
        todos: [],
};

export const todoReducer = (state = initialState,action) => {

    switch (action.type)
    {
        case ADD_TODO:
            return {...state ,todos:[...state.todos ,action.payload]};
        
        case DELETE_TODO:
            return {
                ...state,todos: state.todos.filter((_,i) => i !== action.payload),
            };
        default:
            return state;


    }
}