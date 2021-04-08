import { API_URL, KEY, RES_PER_PAGE } from './config';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import { getJSON } from './helper';

export const state = {
  recipe: {},
  search: {
    query: '',
    page: 1,
    results: [],
    resultsPerPage: RES_PER_PAGE,
  },
  bookmark: [],
};

export const loadFullRecipe = async function (id) {
  try {
    const data = await getJSON(
      `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
    );
    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    if (state.bookmark.some((bookmark) => bookmark.id === id))
      state.recipe.bookmark = true;
    else state.recipe.bookmark = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map((rec) => {
      return {
        id: rec.id,
        title: rec.title,
        image: rec.image_url,
        publisher: rec.publisher,
      };
    });
  } catch (err) {
    throw err;
  }
};

export const searchResultPage = (page = state.search.page) => {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

export const addBookmark = (recipe) => {
  //Add Bookmark
  state.bookmark.push(recipe);
  //Mark current recipe bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmark = true;
};

export const deleteBookmark = function (id) {
  //Delete bookmark
  const index = state.bookmark.findIndex((el) => el.id === id);
  state.bookmark.splice(index, 1);
  //Mark current recipe NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmark = false;
};
