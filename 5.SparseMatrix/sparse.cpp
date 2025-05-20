#include <iostream>
using namespace std;

struct Entry {
    int row;
    int col;
    double value;
    bool used;  // marks if this slot is occupied

    Entry() : row(-1), col(-1), value(0), used(false) {}
};

class SparseMatrix {
private:
    Entry* table;
    size_t capacity;
    size_t count;

    // Simple hash function for (row, col)
    size_t hash(int row, int col) const {
        // Use a large prime to spread values
        size_t hashVal = (size_t)row * 73856093 ^ (size_t)col * 19349663;
        return hashVal % capacity;
    }

    // Resize the hash table when load factor > 0.7
    void resize() {
        size_t oldCapacity = capacity;
        capacity *= 2;
        Entry* oldTable = table;

        table = new Entry[capacity];
        count = 0;

        for (size_t i = 0; i < oldCapacity; i++) {
            if (oldTable[i].used) {
                set(oldTable[i].row, oldTable[i].col, oldTable[i].value);
            }
        }
        delete[] oldTable;
    }

public:
    SparseMatrix(size_t initialCapacity = 8) {
        capacity = initialCapacity;
        count = 0;
        table = new Entry[capacity];
    }

    ~SparseMatrix() {
        delete[] table;
    }

    void set(int row, int col, double value) {
        if (value == 0.0) {
            // Remove entry if exists
            size_t index = hash(row, col);
            size_t start = index;
            while (table[index].used) {
                if (table[index].row == row && table[index].col == col) {
                    table[index].used = false;
                    count--;
                    return;
                }
                index = (index + 1) % capacity;
                if (index == start) break;
            }
            return;
        }

        // Resize if load factor > 0.7
        if ((double)(count + 1) / capacity > 0.7) {
            resize();
        }

        size_t index = hash(row, col);
        while (table[index].used) {
            if (table[index].row == row && table[index].col == col) {
                table[index].value = value; // update existing
                return;
            }
            index = (index + 1) % capacity;
        }

        // Insert new
        table[index].row = row;
        table[index].col = col;
        table[index].value = value;
        table[index].used = true;
        count++;
    }

    double get(int row, int col) const {
        size_t index = hash(row, col);
        size_t start = index;
        while (table[index].used) {
            if (table[index].row == row && table[index].col == col) {
                return table[index].value;
            }
            index = (index + 1) % capacity;
            if (index == start) break;
        }
        return 0.0;
    }

    size_t nonZeroCount() const {
        return count;
    }

    // Iterator over non-zero entries
    class Iterator {
    private:
        const SparseMatrix& matrix;
        size_t index;

        void advance() {
            while (index < matrix.capacity && !matrix.table[index].used)
                index++;
        }

    public:
        Iterator(const SparseMatrix& m, size_t start) : matrix(m), index(start) {
            advance();
        }

        bool operator!=(const Iterator& other) const {
            return index != other.index;
        }

        void operator++() {
            index++;
            advance();
        }

        Entry operator*() const {
            return matrix.table[index];
        }
    };

    Iterator begin() const {
        return Iterator(*this, 0);
    }

    Iterator end() const {
        return Iterator(*this, capacity);
    }

    // transpose method: returns a new SparseMatrix with rows and cols swapped
    SparseMatrix transpose() const {
        SparseMatrix transposed(capacity);
        for (size_t i = 0; i < capacity; i++) {
            if (table[i].used) {
                transposed.set(table[i].col, table[i].row, table[i].value);
            }
        }
        return transposed;
    }
};

int main() {
    SparseMatrix sm;

    sm.set(1, 2, 3.5);
    sm.set(0, 0, 2.2);
    sm.set(1, 2, 0); // remove element at (1,2)

    cout << "Value at (1,2): " << sm.get(1, 2) << endl;  // Output: 0
    cout << "Value at (0,0): " << sm.get(0, 0) << endl;  // Output: 2.2
    cout << "Non-zero count: " << sm.nonZeroCount() << endl; // Output: 1

    // Insert multiple values to test iterator
    sm.set(2, 3, 4.4);
    sm.set(4, 5, 5.5);

    cout << "Non-zero entries:\n";
    for (auto entry : sm) {
        cout << "  (" << entry.row << ", " << entry.col << ") = " << entry.value << "\n";
    }

    // Test transpose
    SparseMatrix transposed = sm.transpose();

    cout << "Transposed entries:\n";
    for (auto entry : transposed) {
        cout << "  (" << entry.row << ", " << entry.col << ") = " << entry.value << "\n";
    }

    return 0;
}
