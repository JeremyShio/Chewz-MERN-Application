module.exports = (req, res) => {
    // Delete the stored jsonWebToken upon user logout
    res.cookie('jswToken', '', { maxAge: 900000, httpOnly: true });
    res.redirect('/auth/login');
};