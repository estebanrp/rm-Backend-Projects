#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <time.h>

#define NUM_CATEGORIES 4

const char *categories[NUM_CATEGORIES] = {
    "food", "serv", "super", "oth"
};

typedef struct {
    int id;
    float amount;
    char category[20];
    char description[30];
    char date[20];
} Expense;

int is_in(const char *array[], int size, const char *value);
int is_numeric(const char *str);
void get_current_date(char *date);
void save_expense(Expense exp);
void print_expenses(); 
int get_next_id();
void months();

int main(int argc, char *argv[]) {
    
    if (strcmp(argv[1], "add") == 0) {
        if (is_numeric(argv[2])) {
            if (is_in(categories, NUM_CATEGORIES, argv[3])) {
                Expense exp;
                exp.id = get_next_id();  
                exp.amount = atof(argv[2]);  
                strcpy(exp.category, argv[3]);
                strcpy(exp.description, argv[4]);
                get_current_date(exp.date);  
                save_expense(exp);
                printf("Expense added: ID=%d, Amount=%.2f, Category='%s', Date='%s'.\n", exp.id, exp.amount, exp.category, exp.date);
            } else {
                printf("Category '%s' not found.\n", argv[3]);
            }
        } else {
            printf("Invalid amount, must be a number.\n");
        }

    } else if (strcmp(argv[1], "print") == 0) {
        printf("Expenses:\n");
        print_expenses();

    } else if (strcmp(argv[1], "month") == 0){
        months();

    } else {
        printf("Incorrect command entered!\n");
        printf("Usage: <command> <amount> <category> <description>\n");
    }

    return 0;
}

int is_in(const char *array[], int size, const char *value) {
    for (int i = 0; i < size; i++) {
        if (strcmp(array[i], value) == 0) {
            return 1;
        }
    }
    return 0;
}

int is_numeric(const char *str) {
    if (*str == '\0') return 0;
    while (*str) {
        if (!isdigit((unsigned char)*str)) return 0;
        str++;
    }
    return 1;
}

void get_current_date(char *date) {
    time_t t = time(NULL);
    struct tm *tm_info = localtime(&t);
    strftime(date, 20, "%Y-%m-%d", tm_info); 
}

void save_expense(Expense exp) {
    FILE *file = fopen("expenses.txt", "a");
    if (file == NULL) {
        printf("Could not open file for writing.\n");
        return;
    }
    
    fprintf(file, "%d|%f|%s|%s|%s\n", exp.id, exp.amount, exp.category, exp.description, exp.date);
    fclose(file);
}

void print_expenses() {
    FILE *file = fopen("expenses.txt", "r");
    if (file == NULL) {
        printf("No expenses found.\n");
        return;
    }

    printf("\n%-5s %-10s %-15s %-25s %-10s\n", "ID", "Amount", "Category", "Description", "Date");
    printf("---------------------------------------------------------------------\n");

    char line[200];
    while (fgets(line, sizeof(line), file)) {
        int id;
        float amount;
        char category[20], description[100], date[20];

        line[strcspn(line, "\n")] = '\0';  
        int parsed_items = sscanf(line, "%d|%f|%19[^|]|%99[^|]|%19[^\n]", &id, &amount, category, description, date);

        if (parsed_items != 5) {
            printf("Error: invalid data format in line: %s\n", line);
            continue;
        }

        printf("%-5d $%-9.2f %-15s %-25s %-10s\n", id, amount, category, description, date);
    }
    fclose(file);
}

int get_next_id() {
    FILE *file = fopen("expenses.txt", "r");
    int id = 1;
    if (file != NULL) {
        Expense exp;
        char line[200];
        while (fgets(line, sizeof(line), file)) {
            int parsed_items = sscanf(line, "%d|%f|%19[^|]|%99[^|]|%19[^\n]", &exp.id, &exp.amount, exp.category, exp.description, exp.date);
            if (parsed_items == 5) {
                if (exp.id >= id) {
                    id = exp.id + 1;
                }
            }
        }
        fclose(file);
    }
    return id;
}

void months(){
    FILE *file = fopen("expenses.txt", "r");
    if (file == NULL) {
        printf("No expenses found.\n");
        return;
    }

    int id, file_year, file_month, file_day;
    float amount, monthly_exp = 0;
    char category[20], description[100], date[20];

    printf("Monthly expenses breakdown:\n");

    int current_month = -1;

    char line[200];
    while (fgets(line, sizeof(line), file)) {
        line[strcspn(line, "\n")] = '\0';  
        int parsed_items = sscanf(line, "%d|%f|%19[^|]|%99[^|]|%19[^\n]", &id, &amount, category, description, date);

        if (parsed_items != 5) {
            printf("Error: invalid data format in line: %s\n", line);
            continue;
        }

        sscanf(date, "%d-%d-%d", &file_year, &file_month, &file_day);

        if (current_month == -1) {
            current_month = file_month;
            monthly_exp = 0;
        }

        if (file_month == current_month) {
            monthly_exp += amount;
        } else {
            printf("The expenses for month %d were: %.2f\n", current_month, monthly_exp);
            current_month = file_month;
            monthly_exp = amount;
        }
    }

    if (current_month != -1) {
        printf("The expenses for month %d were: %.2f\n", current_month, monthly_exp);
    }

    fclose(file);
}
