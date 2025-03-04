#include <iostream>
#include <random>
#include <ctime>
#include <sstream>
#include <iomanip>
#include <cstdlib>

char numbers[] = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9'};
char letters[] = {'a', 'A', 'b', 'B', 'c', 'C', 'd', 'D', 'e', 'E', 'f', 'F', 'g', 'G', 'h', 'H',
                  'i', 'I', 'j', 'J', 'k', 'K', 'l', 'L', 'm', 'M', 'n', 'N', 'o', 'O', 'p', 'P',
                  'q', 'Q', 'r', 'R', 's', 'S', 't', 'T', 'u', 'U', 'v', 'V', 'w', 'W', 'x', 'X',
                  'y', 'Y', 'z', 'Z'};
char alphanumeric[] = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                       'a', 'A', 'b', 'B', 'c', 'C', 'd', 'D', 'e', 'E', 'f', 'F', 'g', 'G', 'h', 'H',
                       'i', 'I', 'j', 'J', 'k', 'K', 'l', 'L', 'm', 'M', 'n', 'N', 'o', 'O', 'p', 'P',
                       'q', 'Q', 'r', 'R', 's', 'S', 't', 'T', 'u', 'U', 'v', 'V', 'w', 'W', 'x', 'X',
                       'y', 'Y', 'z', 'Z'};


std::string date(){
    std::time_t t = std::time(nullptr);
    std::tm* tmPtr = std::localtime(&t);    
    std::ostringstream oss;
    oss << std::put_time(tmPtr, "%y%m%d");    
    return oss.str();
}

char getAny(const char arr[], int size) {
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(0, size - 1);
    return arr[dis(gen)];
}

std::string random(int type, int digits) {
    std::string random_str;
    switch (type) {
        case 2:
            for (int i = 0; i < digits; i++) {
                random_str += getAny(numbers, sizeof(numbers) / sizeof(numbers[0]));
            }
            break;
        case 3:
            for (int i = 0; i < digits; i++) {
                random_str += getAny(letters, sizeof(letters) / sizeof(letters[0]));
            }
            break;
        case 4:
            for (int i = 0; i < digits; i++) {
                random_str += getAny(alphanumeric, sizeof(alphanumeric) / sizeof(alphanumeric[0]));
            }
            break;
        case 5:
            return date();
        default:
            return "Invalid type";
    }
    return random_str;
}


int main(int argc, char* argv[]) {
    if (argc < 3) {
        std::cerr << "Usage: " << argv[0] << " <type> <length>\n";
        return 1;
    }    
    int type = std::stoi(argv[1]);
    int length = std::stoi(argv[2]);
    /*if (length < 5) {
        std::cerr << "Error: Invalid length" << std::endl;
        return 1;
    }*/

    std::string data = random(type, length);
    std::cout << data << std::endl;
    return 0;
}