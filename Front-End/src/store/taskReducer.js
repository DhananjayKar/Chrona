export const initialState = [];

export function taskReducer(state, action) {
  switch (action.type) {
    case "SET":
      return action.payload;

    case "ADD":
      return [
        ...state,
        action.payload
      ];

    case "TOGGLE":
      return state.map((t) =>
        t.id === action.payload
          ? { ...t, completed: !t.completed }
          : t
      );

  case "EDIT":
    return state.map((t) =>
      t.id === action.payload.id
        ? {
            ...t,
            title: action.payload.title,
            time:
                  action.payload.time !== undefined
                    ? action.payload.time
                    : t.time,
          }
        : t
    );

    case "REORDER":
      return action.payload;

    case "DELETE":
      return state.filter((t) => t.id !== action.payload);

    default:
      return state;
  }
}
