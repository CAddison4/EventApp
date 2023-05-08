import { TextInput, StyleSheet, Button } from "react-native";
// import { setSearchQuery, searchQuery } from "../../../state/searchQuery";

export default function SearchBar({
	value,
	onChangeText,
	onSubmitEditing,
	onPress,
	color = "#000",
	backgroundColor = "#fff",
}) {
	return (
		<>
			<TextInput
				placeholder="Search..."
				value={value}
				onChangeText={onChangeText}
				onSubmitEditing={onSubmitEditing}
				style={[
					styles.searchBar,
					{
						color: color,
						// backgroundColor: backgroundColor
					},
				]}
			/>
			{/* <Button title="Search" onPress={onPress} /> */}
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
		paddingBottom: 2,
		fontSize: 18,
		borderBottomWidth: 1,
		borderBottomColor: "#000",
	},

	searchBar: {
		paddingBottom: 2,
		fontSize: 18,
		borderBottomColor: "#000",
		width: 300,
	},
});
