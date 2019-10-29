const userIdSelector = state => state.auth.user && state.auth.user.profile.sub;

export default userIdSelector;
