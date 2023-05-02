import { TextInput, StyleSheet, Button } from "react-native";
// import { setSearchQuery, searchQuery } from "../../../state/searchQuery";
import SearchButton from "./SearchButton";

export default function SearchBar({
	value,
	onChangeText,
	onSubmitEditing,
	onPress,
}) {
	return (
		<>
			<TextInput
				placeholder="Search..."
				value={value}
				onChangeText={onChangeText}
				onSubmitEditing={onSubmitEditing}
				style={styles.searchBar}
			/>
			<Button title="Search" onPress={onPress} />
			{/* <SearchButton onPress={filterUsers} /> */}
		</>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: "#fff",
	},
	nameInput: {
		paddingBottom: 8,
		fontSize: 24,
		borderBottomWidth: 1,
		borderBottomColor: "#000",
	},

	searchBar: {
		paddingBottom: 8,
		fontSize: 24,
		// borderBottomWidth: 1,
		borderBottomColor: "#000",
	},
});
