import { Cocktail } from "../../services/types";
import "./CocktailCard.scss";

interface CocktailCardProps {
  cocktail: Cocktail;
}

const CocktailCard = ({ cocktail }: CocktailCardProps) => {
  return (
    <div className="cocktail-card border-1 border-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-300 flex items-start space-x-2 p-4">
      <img src={cocktail.image} alt={cocktail.name} className="w-36" />
      <div className="p-4 w-full flex flex-col justify-between space-y-4">
        <h3 className="cocktail-name text-lg text-whit">{cocktail.name}</h3>
        <div className="flex items-center space-x-2">
          <span className="cocktail-category rounded-lg px-2 py-2 border-1 border-white">
            {cocktail.category}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CocktailCard;
