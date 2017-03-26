document.addEventListener("keydown",key_down);

// Множество операторов
var operators = new Set(['+', '-', '/', '*', '%']);
// Логическая переменная, определяющая, что хранится в текстовом поле
var filed_contains_result = false;

// Лист дерева
function Node(val)
{
	this.val = val;
	this.parent = null;
	this.left = null;
	this.right = null;
}

// Корень
function Tree(val)
{
	var node = new Node(val);
	this.root = node;
}

// Событие нажатия клавиши
function key_down(ev_param)
{
	new_input(ev_param.keyCode, ev_param.shiftKey);
}

// Добавляем символ в строку ввода
function new_input(code, shift_pressed)
{
	if (filed_contains_result)
	{
		tbResult.value = "";
		filed_contains_result = false;
	}
	// Т.к. код клавиши, а не символа - необходимо отличать их с помощью шифта
	// + функциональные клавиши
	switch (code)
	{
		case 8:
		{
			if (tbResult.value.length > 0)
				tbResult.value = tbResult.value.substring(0,tbResult.value.length-1);
			break;
		}
		case 13:
		{
			calculate();
			break;
		}
		case 46:
		{
			tbResult.value="";
			break;
		}
		case 48:
		{
			if (shift_pressed)
				tbResult.value += ")";
			else
				tbResult.value += "0";
			break;
		}
		case 53:
		{
			if (shift_pressed)
				tbResult.value = try_insert_symbol(tbResult.value, '%');
			else
				tbResult.value += "5";
			break;
		}
		case 56:
		{
			if (shift_pressed)
				tbResult.value = try_insert_symbol(tbResult.value, '*');
			else
				tbResult.value += "8";
			break;
		}
		case 57:
		{
			if (shift_pressed)
				tbResult.value += "(";
			else
				tbResult.value += "9";
			break;
		}
		case 187:
		{
			if (shift_pressed)
				tbResult.value = try_insert_symbol(tbResult.value, '+');
			else
				calculate();
			break;
		}
		case 188:
		case 190:
		{
			tbResult.value = try_insert_dot(tbResult.value);
			break;
		}
		case 109:
		case 189:
		{
			tbResult.value = try_insert_symbol(tbResult.value, '-');
			break;
		}
		case 191:
		{
			if (shift_pressed)
				tbResult.value = try_insert_dot(tbResult.value);
			else
				tbResult.value = try_insert_symbol(tbResult.value, '/');
			break;
		}
		case 96:
		{
			tbResult.value += "0";
			break;
		}
		case 49:
		case 97:
		{
			tbResult.value += "1";
			break;
		}
		case 50:
		case 98:
		{
			tbResult.value += "2";
			break;
		}
		case 51:
		case 99:
		{
			tbResult.value += "3";
			break;
		}
		case 52:
		case 100:
		{
			tbResult.value += "4";
			break;
		}
		case 101:
		{
			tbResult.value += "5";
			break;
		}
		case 54:
		case 102:
		{
			tbResult.value += "6";
			break;
		}
		case 55:
		case 103:
		{
			tbResult.value += "7";
			break;
		}
		case 104:
		{
			tbResult.value += "8";
			break;
		}
		case 105:
		{
			tbResult.value += "9";
			break;
		}
		case 106:
		{
			tbResult.value = try_insert_symbol(tbResult.value, '*');
			break;
		}
		case 107:
		{
			tbResult.value = try_insert_symbol(tbResult.value, '+');
			break;
		}
		case 110:
		{
			tbResult.value = try_insert_dot(tbResult.value);
			break;
		}
		case 111:
		{
			tbResult.value = try_insert_symbol(tbResult.value, '/');
			break;
		}
	}
}

// Некоторая обработка ввода. Чтобы было невозможно поставить 2 оператора подряд
function try_insert_symbol(str, symbol)
{
	if (operators.has(str[str.length-1]))
		{
			return str.substr(0,str.length-1) + symbol;
		}
		else
		{
			return str + symbol;
		}
}

// Некоторая обработка ввода. Обработка постановки точки
function try_insert_dot(str)
{
	var no_dot_found = true;
	for (var i = str.length-1; (i>=0) && !operators.has(str[i]) && no_dot_found; i--)
	{
		no_dot_found = str[i] != '.';
	}
	
	if (no_dot_found)
		return str + '.';
	else
		return str;
}

// Если число открывающихся скобок больше/меньше закрывающихся, 
// то делать какие-либо вычисления не имеет смысла
function is_correct(str)
{
	var par=0;
	for (var i=0; i<str.length; i++)
	{
		if (str[i] == '(') par++;
		if (str[i] == ')') par--;
		if (operators.has(str[i]) && (str[i]!='-') && ((str[i-1]=='(') || (i==0))) return false;
	}
	
	return par == 0;
}

// Вычисление выражения
function calculate()
{
	var con = tbResult.value;
	if (!is_correct(con))
	{
		tbResult.value = "Ошибка";
		filed_contains_result = true;
		return;
	}
	
	// Предварительные вычисления
	con = preliminary_transform(tbResult.value);
	tbResult.value = "";
	
	// Строим синтаксическое дерево
	var tree = new Tree("");
	var currentNode = tree.root;

	var substr="";
	try {
		for (var i=0; i<con.length; i++)
		{
			switch (con[i])
			{
				case '(':
				{
					currentNode.left = new Node("");
					currentNode.left.parent = currentNode;
					currentNode = currentNode.left;	
					break;
				}
				case ')':
				{
					if (substr!="")
					{
						var operand = parseFloat(substr);
						currentNode.val = operand;
						currentNode = currentNode.parent;
						substr="";
					}
					currentNode = currentNode.parent;
					break;
				}
				case '+':
				case '-':
				case '%':
				case '/':
				case '*':
				{
					if (substr!="")
					{
						var operand = parseFloat(substr);
						currentNode.val = operand;
						currentNode = currentNode.parent;
						substr="";
					}
					currentNode.val=con[i];
					currentNode.right = new Node("");
					currentNode.right.parent = currentNode;
					currentNode = currentNode.right;			
					break;
				}
				default:
				{
					substr += con[i];
					break;
				}
			}
		}
	}
	catch (er)
	{
		alert(er);
	}
	
	// Оптимизируем дерево - уберем лишние скобки
	tree.root = optimize_tree(tree.root);
	
	// Вычислим выражение
	tbResult.value = calc_tree(tree.root);
	filed_contains_result = true;
}

// Предварительные вычисления. Обернем *,% и / в скобки
function preliminary_transform(some_string)
{
	var result_string = '(' + some_string + ')';
	
	for (var j=0; j<result_string.length; j++)
	{
		if ((result_string[j] == '-') && (result_string[j-1]=='('))
		{
			result_string=result_string.slice(0,j) + '0' + result_string.slice(j,result_string.length);
			j++;
		}
		if ((result_string[j] == '*') || (result_string[j] == '/') || (result_string[j] == '%'))
		{
			result_string = insert_brackets(result_string, j);
			// Слева вставили скобку, надо сместить итератор вправо
			j++;
		}
	}
	
	return result_string;
}

// Функция оборачивания выражения в скобки
function insert_brackets(some_string, position)
{
	// Количество открытых/закрытых скобок
	var par;
	// Позиция в строке
	var i;
	
	par = 0;
	for (i=position-1; (i>=0) && (!operators.has(some_string[i]) && (some_string[i]!='(') || (par>0)); i--)
		{
			if (some_string[i]==')') par++;
			if (some_string[i]=='(') par--;
		}
	if (i<0) throw ("Ошибка в левой части операции в позиции " + position + " (Лишние скобки?)");
	some_string=some_string.slice(0,i+1) + '(' + some_string.slice(i+1,some_string.length);
	par = 0;
	for (i=position+2; (i<some_string.length) && (!operators.has(some_string[i]) && (some_string[i]!=')') || (par>0)); i++)
		{
			if (some_string[i]=='(') par++;
			if (some_string[i]==')') par--;
		}
	if (i>=some_string.length) throw ("Ошибка в правой части операции в позиции " + position + " (Лишние скобки?)");
	some_string=some_string.slice(0,i) + ')' + some_string.slice(i,some_string.length);
	
	return some_string;
}

// Оптимизация дерева
function optimize_tree(node)
{
	if (node==null) return null;
	while((node.left!=null) && (node.right==null) || (node.left==null) && (node.right!=null))
	{
		if (node.left==null) node = node.right;
		if (node.right==null) node = node.left;
	}
	
	node.left = optimize_tree(node.left);
	node.right = optimize_tree(node.right);
	return node;
}

// Вычисление дерева
function calc_tree(node)
{
	switch(node.val)
	{
		case '%': return calc_tree(node.left) % calc_tree(node.right);
		case '*': return calc_tree(node.left) * calc_tree(node.right);
		case '/': return calc_tree(node.left) / calc_tree(node.right);
		case '+': return calc_tree(node.left) + calc_tree(node.right);
		case '-': return calc_tree(node.left) - calc_tree(node.right);
		default: return node.val;
	}
}