const axios = require('axios');




module.exports = async(req, res) => {
    const slug = req.params.slug;
    
    let listData = {};

    const query = `
        query listBySlug($slug: String!) {
            listBySlug( slug: $slug ) {
                id,
                slug,
                title,
                description,
                notes {
                    id,
                    restaurant,
                    person,
                    order,
                    comment
                }
            }
        }
    `

    try {
        
        const { data } = await axios.post(process.env.GRAPHQL_ENDPOINT,
            {
                query,
                variables: { slug }
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        
        listData = data.data.listBySlug;

        res.render('list', { list: listData });

    } catch(err) {
        console.log(err);
    };
};