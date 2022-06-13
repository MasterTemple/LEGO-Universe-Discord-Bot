import { CDClient } from "./cdclient";
import { NameValuePair } from "./luInterfaces";

export async function getAutocompleteOptions(cdclient: CDClient, name: string, value: string): Promise<NameValuePair[]> {
  let autocompleteOptions: NameValuePair[] = [];
  switch (name) {
    case "activity":
      // autocompleteOptions = await cdclient.searchActivity(value)
      autocompleteOptions = await cdclient.searchFullActivity(value);
      break;
    case "get":
    case "preconditions":
    case "item":
    case "buy":
    case "drop":
    case "earn":
    case "reward":
    case "unpack":
      autocompleteOptions = await cdclient.searchItem(value);
      // autocompleteOptions = cdclient.locale.searchObjects(value)
      break;

    case "brick":
      autocompleteOptions = await cdclient.searchBrick(value);
      break;

    case "loottable":
      autocompleteOptions = cdclient.locale.searchLootTable(value);
      break;

    case "package":
      autocompleteOptions = await cdclient.searchPackage(value);
      break;

    case "mission":
      autocompleteOptions = cdclient.locale.searchMissions(value);
      break;

    case "enemy":
      autocompleteOptions = await cdclient.searchEnemy(value)
      break;
    case "smash":
      autocompleteOptions = await cdclient.searchSmashable(value);
      break;

    case "skill":
    case "skillitems":
      autocompleteOptions = cdclient.locale.searchSkills(value);
      break;

    case "npc":
      autocompleteOptions = await cdclient.searchMissionNPC(value);
      break;

    case "vendor":
      autocompleteOptions = await cdclient.searchVendor(value);
      break;

    default:
      autocompleteOptions = await cdclient.searchObject(value);
  }
  return autocompleteOptions;
}