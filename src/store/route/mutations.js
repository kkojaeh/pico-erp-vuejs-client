export const lastAccessed = (state, payload) => {
  state.lastAccessed = payload;
};
export const to = (state, payload) => {
  state.to = payload;
};

export const next = (state, payload) => {
  state.next = payload;
};