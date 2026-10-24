function Recipe(props) {
    const index = props.id()
    console.log(index)

	return (
		<>
			<h1>Recipe page {index} is here</h1>
		</>
	);
}

export default Recipe;
