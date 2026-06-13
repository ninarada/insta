/**
 * Uspoređuje Instagram followers i following podatke.
 * Vraća popis korisničkih imena ljudi koje ti pratiš, a oni tebe NE prate.
 * * @param {Array} followersData - Sadržaj iz followers_1.json
 * @param {Object} followingData - Sadržaj iz following.json
 * @returns {Array} - Niz stringova (korisničkih imena)
 */
export const compareLists = (followersData, followingData) => {
    if (!followersData || !followingData) return [];
  
    const followers = followersData.map(item => {
      return item.string_list_data?.[0]?.value;
    }).filter(Boolean);
  
    const followingList = followingData.relationships_following || [];
    const following = followingList.map(item => {
      return item.title || item.string_list_data?.[0]?.value;
    }).filter(Boolean);
  
    const followersSet = new Set(followers);
    const notFollowingBack = following.filter(username => !followersSet.has(username));
    
    return notFollowingBack;
    
  };