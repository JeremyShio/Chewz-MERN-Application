const axios = require('axios');




const userData = async (req, res, next) => {
    
    if (!req.verifiedUser) {
        next();
        return;
    };

    const query = `
        query user($id: ID!){
            user(id: $id){
            id,
            lists{
                id,
                slug,
                title,
                description,
                notes{
                    restaurant,
                    person,
                    comment,
                    order
                    }
                }
            }
        }
    `

    let data = {};

    try {
        data = await axios.post(process.env.GRAPHQL_ENDPOINT,
            {
                query,
                variables: {
                    id: req.verifiedUser.user._id
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

    } catch(error) {
        console.log(error);
    };

    req.verifiedUser.user.lists = data?.data?.data?.user?.lists ?? [];

    next();
};


module.exports = { userData };