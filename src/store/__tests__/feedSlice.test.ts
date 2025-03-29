import feedReducer, { FeedState, fetchFeed } from '../slices/feedSlice';

jest.mock('@api', () => ({
  getFeedsApi: jest.fn()
}));

describe('тесты для данных ленты', () => {
  const initialState: FeedState = {
    orders: [],
    status: 'idle',
    isLoading: false,
    error: null,
    total: null,
    totalToday: null
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('обрабатывание pending состояния', () => {
    const action = { type: fetchFeed.pending.type };
    const state = feedReducer(initialState, action);

    expect(state.status).toBe('loading');
    expect(state.isLoading).toBe(true);
  });

  it('обрабатывание fulfilled состояния', () => {
    const mockResponse = {
      orders: [
        { _id: '1', number: 1, status: 'done' },
        { _id: '2', number: 2, status: 'pending' }
      ],
      total: 100,
      totalToday: 10
    };

    const action = {
      type: fetchFeed.fulfilled.type,
      payload: mockResponse
    };

    const state = feedReducer(initialState, action);

    expect(state.status).toBe('succeeded');
    expect(state.orders).toEqual(mockResponse.orders);
    expect(state.total).toBe(mockResponse.total);
    expect(state.totalToday).toBe(mockResponse.totalToday);
    expect(state.isLoading).toBe(false);
  });

  it('обрабатывание rejected состояния', () => {
    const error = new Error('Тестовая ошибка');
    const action = {
      type: fetchFeed.rejected.type,
      error: { message: error.message }
    };

    const state = feedReducer(initialState, action);

    expect(state.status).toBe('failed');
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(error.message);
  });
});
