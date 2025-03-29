import { TConstructorIngredient } from '@utils-types';
import orderReducer, {
  addIngredient,
  fetchOrder,
  moveIngredient,
  removeIngredient,
  setBun
} from '../slices/orderSlice';

jest.mock('@api', () => ({
  orderBurgerApi: jest.fn()
}));

describe('тесты для данных заказа', () => {
  const mockIngredient: TConstructorIngredient = {
    _id: '1',
    name: 'Булка 1',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    id: '1',
    uniqueId: 'test-unique-id'
  };

  const initialState = {
    bun: null,
    ingredients: [],
    status: 'idle' as const,
    isLoading: false,
    orderModalData: null,
    error: null
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('установка булки в конструктор', () => {
    const state = orderReducer(initialState, setBun(mockIngredient));

    expect(state.bun).toEqual(mockIngredient);
  });

  it('замена булки на другую', () => {
    const secondBun = {
      ...mockIngredient,
      _id: '2',
      id: '2',
      name: 'Булка 2',
      price: 988
    };

    let state = orderReducer(initialState, setBun(mockIngredient));
    state = orderReducer(state, setBun(secondBun));

    expect(state.bun).toEqual(secondBun);
    expect(state.bun).not.toEqual(mockIngredient);
  });

  it('добавление ингредиента в конструктор', () => {
    const state = orderReducer(initialState, addIngredient(mockIngredient));

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject({
      ...mockIngredient,
      uniqueId: expect.any(String)
    });
  });

  it('добавление нескольких ингредиентов в конструктор', () => {
    const secondIngredient = {
      ...mockIngredient,
      _id: '3',
      id: '3',
      name: 'Ингредиент 1'
    };

    let state = orderReducer(initialState, addIngredient(mockIngredient));
    state = orderReducer(state, addIngredient(secondIngredient));

    expect(state.ingredients).toHaveLength(2);
    expect(state.ingredients[0]).toMatchObject({
      ...mockIngredient,
      uniqueId: expect.any(String)
    });
    expect(state.ingredients[1]).toMatchObject({
      ...secondIngredient,
      uniqueId: expect.any(String)
    });
  });

  it('удаление ингредиента из конструктора', () => {
    const stateWithIngredient = {
      ...initialState,
      ingredients: [mockIngredient]
    };

    const state = orderReducer(stateWithIngredient, removeIngredient(0));

    expect(state.ingredients).toHaveLength(0);
  });

  it('перемещение начинки в конструкторе', () => {
    const filling1 = {
      ...mockIngredient,
      _id: '2',
      id: '2',
      name: 'Начинка 1',
      type: 'main'
    };

    const filling2 = {
      ...mockIngredient,
      _id: '3',
      id: '3',
      name: 'Начинка 2',
      type: 'main'
    };

    let state = orderReducer(initialState, addIngredient(filling1));
    state = orderReducer(state, addIngredient(filling2));

    // Проверка невозможности перемещения первого ингредиента вверх
    state = orderReducer(state, moveIngredient({ index: 0, direction: 'up' }));
    expect(state.ingredients[0].name).toBe('Начинка 1');
    expect(state.ingredients[1].name).toBe('Начинка 2');

    // Проверка перемещения второго ингредиента вверх
    state = orderReducer(state, moveIngredient({ index: 1, direction: 'up' }));
    expect(state.ingredients[0].name).toBe('Начинка 2');
    expect(state.ingredients[1].name).toBe('Начинка 1');

    // Проверка перемещения первого ингредиента вниз
    state = orderReducer(
      state,
      moveIngredient({ index: 0, direction: 'down' })
    );
    expect(state.ingredients[0].name).toBe('Начинка 1');
    expect(state.ingredients[1].name).toBe('Начинка 2');

    // Проверка невозможности перемещения последнего ингредиента вниз
    state = orderReducer(
      state,
      moveIngredient({ index: 1, direction: 'down' })
    );
    expect(state.ingredients[0].name).toBe('Начинка 1');
    expect(state.ingredients[1].name).toBe('Начинка 2');
  });

  describe('отправка заказа', () => {
    it('обрабатывание pending состояния', () => {
      const action = { type: fetchOrder.pending.type };
      const state = orderReducer(initialState, action);

      expect(state.status).toBe('loading');
      expect(state.isLoading).toBe(true);
    });

    it('обрабатывание fulfilled состояния', () => {
      const mockOrder = {
        order: {
          _id: '1',
          number: 1,
          status: 'done'
        }
      };

      const action = {
        type: fetchOrder.fulfilled.type,
        payload: mockOrder
      };

      const state = orderReducer(initialState, action);

      expect(state.status).toBe('succeeded');
      expect(state.orderModalData).toEqual(mockOrder.order);
      expect(state.isLoading).toBe(false);
      expect(state.ingredients).toEqual([]);
      expect(state.bun).toBeNull();
    });

    it('обрабатывание rejected состояния', () => {
      const error = new Error('Тестовая ошибка');
      const action = {
        type: fetchOrder.rejected.type,
        error: { message: error.message }
      };
      const state = orderReducer(initialState, action);

      expect(state.status).toBe('failed');
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(error.message);
    });
  });
});
