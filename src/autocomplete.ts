import { CDClient } from "./cdclient";
import { NameValuePair } from "./luInterfaces";

export async function getAutocompleteOptions(cdclient: CDClient, name: string, value: string): Promise<NameValuePair[]> {
  let autocompleteOptions: NameValuePair[] = [];
  switch (name) {
    case "activity":
      // autocompleteOptions = await cdclient.searchActivity(value.toString())
      autocompleteOptions = await cdclient.searchFullActivity(value.toString())
      break;

    case "preconditions":
    case "item":
    case "buy":
    case "drop":
    case "earn":
    case "reward":
    case "unpack":
      // autocompleteOptions = await cdclient.searchItem(value.toString())
      autocompleteOptions = cdclient.locale.searchObjects(value.toString())
      break;

    case "brick":
      autocompleteOptions = await cdclient.searchBrick(value.toString())
      break;

    case "loottable":
      autocompleteOptions = cdclient.locale.searchLootTable(value.toString());
      break;

    case "package":
      autocompleteOptions = await cdclient.searchPackage(value.toString());
      break;

    case "mission":
      autocompleteOptions = cdclient.locale.searchMissions(value.toString());
      break;

    case "enemy":
    case "smash":
      autocompleteOptions = await cdclient.searchSmashable(value.toString());
      break;

    case "skill":
    case "skillitems":
      autocompleteOptions = cdclient.locale.searchSkills(value.toString());
      break;

    case "npc":
      autocompleteOptions = await cdclient.searchMissionNPC(value.toString());
      break;

    case "vendor":
      autocompleteOptions = await cdclient.searchVendor(value.toString());
      break;

    default:
      autocompleteOptions = await cdclient.searchObject(value);
  }
  return autocompleteOptions;
}