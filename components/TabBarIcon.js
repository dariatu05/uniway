import { Image } from "react-native";

import ButtonHeart from "../assets/images/buttons/ButtonHeart.png";
import ButtonPerson from "../assets/images/buttons/ButtonPerson.png";
import ButtonSearch from "../assets/images/buttons/ButtonSearch.png";
import ButtonTrain from "../assets/images/buttons/ButtonTrain.png";

const icons = {
  Suche: ButtonSearch,
  Map: ButtonTrain,
  Favoriten: ButtonHeart,
  Profil: ButtonPerson,
};

export default function TabBarIcon({ routeName, focused }) {
  return (
    <Image
      source={icons[routeName]}
      style={{
        width: 25,
        height: 25,
        opacity: focused ? 1 : 0.45,
      }}
      resizeMode="contain"
    />
  );
}
