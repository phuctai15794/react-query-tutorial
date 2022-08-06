import { useState } from 'react';
import TodoList from './features/todos/TodoList';

function App() {
	const [isShowTodoList, setIsShowTodoList] = useState(false);

	const handleShowTodoList = () => {
		setIsShowTodoList(!isShowTodoList);
	};

	return (
		<>
			<button onClick={handleShowTodoList}>Show Todo List</button>
			{isShowTodoList && <TodoList />}
		</>
	);
}

export default App;
