const profile = (req, res) => {
  res.render("profile", { title: "Profile", login: true });
};

module.exports = {
  profile,
};
