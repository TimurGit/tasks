export function maxItemAssociation(listItems) {
    let listRecommendations = [];
    listItems.forEach(listItem => listRecommendations.push(new Set(listItem)));
    listItems.forEach(listItem => {
        listItem.forEach(item => {
            listRecommendations.forEach(rec => {
                if (rec.has(item)) {
                    listItem.forEach(t => rec.add(t))
                }
            })
        })
    })

    return [...(listRecommendations.sort((a, b) => b.size - a.size)[0])].sort();
}