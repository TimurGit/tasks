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
    return listRecommendations.map(t=>[...t].sort().join(''))
        .sort((a, b) => b.length - a.length || a.localeCompare(b))
        .map(t => t.split(''))[0]
}