const axios = require('axios');




module.exports = async (req, res) => {
    const listInputs = req.body

    const listData = {
        userId: req.verifiedUser.user._id,
        title: listInputs.listTitle,
        description: listInputs.listDescription,
        notes: []
    };

    for (const key in listInputs) {
        if (key.includes('noteRestaurant')) {
            const noteNum = parseInt(key.split('noteRestaurant')[1]);

            // If listData note does not exist, add new notes until it does
            while (!listData.notes[noteNum]) {
                listData.notes.push({});
            };
            listData.notes[noteNum].restaurant = listInputs[key];

        } else if (key.includes('notePerson')) {
            const noteNum = parseInt(key.split('notePerson')[1]);
            listData.notes[noteNum].person = listInputs[key];
            listData.notes[noteNum].order = noteNum + 1;

        } else if (key.includes('noteComment')) {
            const noteNum = parseInt(key.split('noteComment')[1]);
            listData.notes[noteNum].comment = listInputs[key];
        };
    };

    const mutation = `
        mutation createList($userId: ID!, $restaurant: String!, $person: String!, $comment: String!, $notes: [NoteInput!]!){
            createList(userId: $userId, restaurant: $restaurant, person: $person, comment: $comment, notes: $notes)
        }
    `
    let listSlug = '';

    try {
        console.log(listData);

        const { data } = await axios.post(process.env.GRAPHQL_ENDPOINT,
            {
                query: mutation,
                variables: listData
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

        listSlug = data.data.createList;

    } catch(err) {
        console.log(err);
    };

    res.redirect('/');
};