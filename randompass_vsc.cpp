#include <iostream>
#include <random>
#include <ctime>
#include <sstream>
#include <iomanip>

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

int main() {
    std::string data = "VSC@" + date() + "@" + random(6);
    std::cout << data << std::endl;
    return 0;
}