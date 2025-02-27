#include <iostream>
#include <random>
#include <ctime>
#include <sstream>
#include <iomanip>
#include <cstdlib>

std::string date(){
    std::time_t t = std::time(nullptr);
    std::tm* tmPtr = std::localtime(&t);    
    std::ostringstream oss;
    oss << std::put_time(tmPtr, "%y%m%d");    
    return oss.str();
}

char getAny(){
    char arr[] = {'a', 'A', 'b', 'B', 'c', 'C', 'd', 'D', 'e', 'E', 'f', 'F', 'g', 'G', 'h', 'H', 'i', 'I', 'j', 'J', 'k', 'K', 'l', 'L', 'm', 'M', 'n', 'N', 'o', 'O', 'p', 'P', 'q', 'Q', 'r', 'R', 's', 'S', 't', 'T', 'u', 'U', 'v', 'V', 'w', 'W', 'x', 'X', 'y', 'Y', 'z', 'Z'};    
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(0, sizeof(arr) / sizeof(arr[0]) - 1);    
    int randomIndex = dis(gen);
    return arr[randomIndex];
}
std::string random(int digits){
    std::string random_str;
    for (int i = 1; i <= digits; i++){
	random_str += getAny();
    }
    return random_str;
}

int main(int argc, char* argv[]) {
    if (argc < 2){
        std::cerr << "Error: Missing length parameter" << std::endl;
        return 1;
    }
    int length = std::stoi(argv[1]);
    if (length < 5) {
        std::cerr << "Error: Invalid length" << std::endl;
        return 1;
    }
    std::string data = "VSC@" + date() + "@" + random(length);
    std::cout << data << std::endl;
    return 0;
}