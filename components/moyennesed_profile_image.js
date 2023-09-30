import { Image } from 'react-native';


function MoyennesEDProfileImage({
  account,
  style,
}) {
  return (
    <Image
      source={{
        uri: `https:${account.imageURL}`,
        headers: {
          'Referer': `http:${account.imageURL}`,
          'Host': 'doc1.ecoledirecte.com',
        },
      }}
      style={style}
    />
  );
}

export default MoyennesEDProfileImage;

