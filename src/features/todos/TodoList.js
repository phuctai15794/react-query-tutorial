import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import { getTodos, addTodo, updateTodo, deleteTodo } from '../../api/todosApi';

const TodoList = () => {
	let content;
	const [isWake, setIsWake] = useState(false);
	const [newTodo, setNewTodo] = useState('');
	const queryClient = useQueryClient();
	const { isLoading, isSuccess, isError, error, refetch, isFetching, data } = useQuery(['todos'], getTodos, {
		enabled: isWake
	});

	// useEffect(() => {
	// 	const timerId = setTimeout(() => {
	// 		setIsWake(true);
	// 	}, 3000);

	// 	return () => {
	// 		clearTimeout(timerId);
	// 	};
	// }, []);

	const addTodoMutation = useMutation(addTodo, {
		onSuccess: () => {
			// Invalidates cache and refetch queries
			queryClient.invalidateQueries(['todos']);
		}
	});

	const updateTodoMutation = useMutation(updateTodo, {
		onSuccess: () => {
			// Invalidates cache and refetch queries
			queryClient.invalidateQueries(['todos']);
		}
	});

	const deleteTodoMutation = useMutation(deleteTodo, {
		onSuccess: () => {
			// Invalidates cache and refetch queries
			queryClient.invalidateQueries(['todos']);
		}
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		addTodoMutation.mutate({
			userId: 1,
			title: newTodo,
			completed: false
		});
		setNewTodo('');
	};

	const formSection = (
		<form onSubmit={handleSubmit}>
			<label htmlFor="new-todo">Enter a new todo item</label>
			<div className="new-todo">
				<input
					type="text"
					id="new-todo"
					value={newTodo}
					onChange={(e) => setNewTodo(e.target.value)}
					placeholder="Enter new todo"
				/>
			</div>
			<button className="submit">
				<FontAwesomeIcon icon={faUpload} />
			</button>
		</form>
	);

	if (isLoading && !isFetching) {
		content = <p>Click the button to get data!!!</p>;
	} else if (isLoading) {
		content = <p>Loading...</p>;
	} else if (isError) {
		content = <p>{error.message}</p>;
	} else if (isSuccess) {
		content = data.map((todo) => {
			return (
				<article key={todo.id}>
					<div className="todo">
						<input
							type="checkbox"
							checked={todo.completed}
							id={todo.id}
							onChange={() => updateTodoMutation.mutate({ ...todo, completed: !todo.completed })}
						/>
						<label htmlFor={todo.id}>{todo.title}</label>
					</div>
					<button className="trash" onClick={() => deleteTodoMutation.mutate({ id: todo.id })}>
						<FontAwesomeIcon icon={faTrash} />
					</button>
				</article>
			);
		});
	} else {
		content = <p>Nothing to show...</p>;
	}

	return (
		<main>
			<h1>Todo List</h1>
			<button onClick={() => refetch()} style={{ marginBottom: '10px' }}>
				Get data
			</button>
			{formSection}
			{content}
		</main>
	);
};

export default TodoList;
